import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs';
import { isSubscription } from 'rxjs/internal/Subscription';
import { TicketDialogComponent } from '../ticket-dialog/ticket-dialog.component';
import { Ticket } from '../ticket';
import { TicketsService } from '../tickets.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ticket-manager',
  templateUrl: './ticket-manager.component.html',
  styleUrls: ['./ticket-manager.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0px'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class TicketManagerComponent implements OnInit {
  
  allTickets: Ticket[] = [];  // will store Tickets generated from service that were passed here by Observable

  constructor(public dialog: MatDialog, private ticketService: TicketsService, public matSnack: MatSnackBar) { }

  openSnackBar(message: string, action: string = 'Close') {
    this.matSnack.open(message, action);
  }

  getTickets(){ // random
    // this.tickets = this.ticketService.getTickets(); synchronous implementation, removed now because we're using asynchronous implem (Observables)
    this.ticketService.getTickets().subscribe(ticketObserver => {this.allTickets = ticketObserver})
  }

  retrieveTickets(){ // from db
    this.ticketService.readDBTicket().snapshotChanges().pipe(
      map(changes =>changes.map( (c: { payload: { key: any; val: () => any; }; })=>
      ({ key: c.payload.key, ...c.payload.val() }) )
      )
    ).subscribe(observer => {
      this.dataSource.data = observer;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.ticketPaginator;
      this.allTickets = observer;
    });
  }
  
  ngOnInit(): void {
    // this.getTickets();  // stored in allTickets
    this.retrieveTickets();
  }

  currPage:string = 'Ticket Manager';
  sideNavIconList : string[] = ['severity--v2', 'two-tickets', 'bar-chart'];
  sideNavSectionList: string[] = ['Dashboard', 'Ticket Manager', 'Analytics'];

  issueTimeOptions = [
    {
      value: 'week-0',
      viewValue: 'Last Week',
    },
    {
      value: 'month-1',
      viewValue: 'Last Month',
    },
    {
      value: 'year-2',
      viewValue: 'Last Year',
    },
    {
      value: 'all-3',
      viewValue: 'Any Time',
    },
  ]
  selectedIssueTimePeriod = 'all-3';
  
  expectedTimeOptions = [
    {
      value: 'nweek-0',
      viewValue: 'In A Week',
    },
    {
      value: 'nmonth-1',
      viewValue: 'In A Month',
    },
    {
      value: 'nyear-2',
      viewValue: 'In A Year',
    },
    {
      value: 'nall-3',
      viewValue: 'Any Time',
    },
  ]
  selectedExpectedTimePeriod = 'nall-3';

  // issueTimeFilter() function is below retrieve tickets so matTableData is declared already

  statusIsPending(status: string): boolean{
    if(status.endsWith('Pending')) return true; // handles AAPending and Pending
    return false;
  }
  statusIsClosed(status: string){
    if(status.endsWith('Closed')) return true;
    return false;
  }
  statusIsHold(status: string){
    if(status.endsWith('Hold')) return true;
    return false;
  }
  statusIsProcessing(status: string){
    if(!this.statusIsClosed(status) && !this.statusIsPending(status)) return true;
    return false;
  }
  lastIcon: string = 'tick';
  giveIcon(status: string){
    return this.statusIsClosed(status)? 'done' : ( this.statusIsPending(status) ? 'schedule' : ( this.statusIsHold(status) ? 'pause_circle' : 'construction' ) )
  }


  displayedColumns: string[] = ['tid','title','company','platform','empEid','dept','priority','duration','expectedDate','status'];
  colNames: string[] = ['TID', 'Title', 'Company', 'Platform', 'Raised By', 'Dept.', 'Priority', 'Duration', 'Expected', 'Status'];

  dataSource = new MatTableDataSource<Ticket>();  // added this.dataSource.data = this.allTickets; below because somehow dataSource doesnt get properly initialized if passed as new MatTableDataSource<Ticket>(this.allTickets);
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('ticketPaginator') ticketPaginator !: MatPaginator;

  ngAfterViewInit() {
    // this.dataSource.data = this.allTickets;   // IMP LINE HERE. needed to add this on getting allTickets from observable, see comment just above this
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.ticketPaginator;

    // see retrieveTickets() function above
  }

  expandedRow: Ticket|null = null;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // very hacky implementation
  searchBoxValue: string = '';
  onlyMyTicketsShown = false;
  @ViewChild('ticketSearch') searchBox!: ElementRef;
  // @ViewChild('mat-slide-toggle') myTicketToggle!: ElementRef;
  myTickets(event: MatSlideToggleChange): void{
    let myTicketToggle: MatSlideToggle = event.source;
    
    let oldData = [...this.dataSource.data];

    if(this.onlyMyTicketsShown){
      this.searchBoxValue = 'marc.almeida@gmail.com';
      let myTickets = oldData.filter((value: Ticket)=>{
        if(value.empEid == 'marc.almeida@gmail.com') return value;
        else return null;
      })
      this.dataSource.data = myTickets;
      this.onlyMyTicketsShown = true;
    }
    else{
      this.searchBoxValue = '';
      this.dataSource.data = oldData;
      this.onlyMyTicketsShown = false;
    }
  }

  issueTimeFilter(){
    alert('change detected')
    let oneWeekBack = new Date(), oneMonthBack = new Date(), oneYearBack = new Date();
    let oneWeekLater = new Date(), oneMonthLater = new Date(), oneYearLater = new Date();
    oneWeekBack.setDate(oneWeekBack.getDate()-7);
    oneMonthBack.setDate(oneMonthBack.getDate()-31);
    oneYearBack.setDate(oneYearBack.getDate()-365);

    oneWeekLater.setDate(oneWeekLater.getDate()+7);
    oneMonthLater.setDate(oneMonthLater.getDate()+31);
    oneYearLater.setDate(oneYearLater.getDate()+365);
    // alert(`1w back: ${oneWeekBack} 1m back: ${oneMonthBack} 1y back: ${oneYearBack}`)

    let issueLimitDate: Date;
    if(this.selectedIssueTimePeriod=='week-0') issueLimitDate = oneWeekBack;
    else if(this.selectedIssueTimePeriod=='month-1') issueLimitDate = oneMonthBack;
    else if(this.selectedIssueTimePeriod=='year-2') issueLimitDate = oneYearBack;
    else issueLimitDate = new Date(1980,0,1);
    
    let expectedLimitDate: Date;
    if(this.selectedExpectedTimePeriod=='nweek-0') expectedLimitDate = oneWeekLater;
    else if(this.selectedExpectedTimePeriod=='nmonth-1') expectedLimitDate = oneMonthLater;
    else if(this.selectedExpectedTimePeriod=='nyear-2') expectedLimitDate = oneYearLater;
    else expectedLimitDate = new Date(2050,0,1);

    let count = 0;
    let filtered = this.allTickets.filter((ticket: Ticket)=>{
      let tickIssue = new Date(ticket.issueDate).getTime();
      let tickExpected = new Date(ticket.expectedDate).getTime();
      if(issueLimitDate.getTime() <= tickIssue && tickExpected <= expectedLimitDate.getTime() ) return ticket;
      else return null;
    })
    this.dataSource.data = filtered;
  }

  createTicket(): void{
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;  // automatically sets focus to first text box
    // dialogConfig.width = '52.5%';
    dialogConfig.width = '45rem';
    dialogConfig.data = {
      ticketDialogTitle: 'Create',
    }

    const dialogRef = this.dialog.open(TicketDialogComponent, dialogConfig);
  }

  updateTicket(ticket: any){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;  // automatically sets focus to first text box
    dialogConfig.width = '45rem';
    dialogConfig.data = {
      ticketDialogTitle: 'Update',
      ticket: ticket,
    };

    const dialogRef = this.dialog.open(TicketDialogComponent, dialogConfig);
  }

  deleteTicket(ticket: any){
    if( confirm(`Are you sure you want to delete Ticket ${ticket.tid}?`) ){
      this.ticketService.deleteDBTicket(ticket.key).then(()=>{
        this.openSnackBar("Successfully deleted ticket "+ticket.key)
      }).catch(err=>alert("ERROR: "+err))
    }
  }

  downloadCSV(){
    let ticketsCSV = [];
    ticketsCSV.push(Object.keys(this.allTickets[0]).join(","));
    this.allTickets.forEach((report, index)=>{
      let row = '"' + Object.values(report).join('","') + '"';
      ticketsCSV.push(row);
    })
    let finalCSVcontent = ticketsCSV.join("\r\n");
    // alert(finalCSVcontent);

    // Source: https://code-boxx.com/javascript-export-array-csv/
    let cb = new Blob([finalCSVcontent],{type: "text/csv"});
    var url = window.URL.createObjectURL(cb);
    var anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "tickets.csv";
    anchor.click();
    window.URL.revokeObjectURL(url);
    anchor.remove()
  }

}

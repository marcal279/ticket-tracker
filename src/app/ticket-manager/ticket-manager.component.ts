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

  constructor(public dialog: MatDialog, private ticketService: TicketsService) { }

  getTickets(){ // random
    // this.tickets = this.ticketService.getTickets(); synchronous implementation, removed now because we're using asynchronous implem (Observables)
    this.ticketService.getTickets().subscribe(ticketObserver => {this.allTickets = ticketObserver})
  }

  retrieveTickets(){ // from db
    this.ticketService.getAllFireList().snapshotChanges().pipe(
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

  timeOptions = [
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
      viewValue: 'All Time',
    },
  ]
  selectedTimePeriod = 'all-3';

  // timeFilter() function is below retrieve tickets so matTableData is declared already

  statusIsPending(status: string): boolean{
    if(status.endsWith('Pending')) return true; // handles AAPending and Pending
    return false;
  }
  statusIsClosed(status: string){
    if(status.endsWith('Closed')) return true;
    return false;
  }
  statusIsProcessing(status: string){
    if(!this.statusIsClosed(status) && !this.statusIsPending(status)) return true;
    return false;
  }
  lastIcon: string = 'tick';

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
    // this.searchBox.nativeElement.value = 'NXT235';
    if(this.onlyMyTicketsShown){
      this.searchBoxValue = 'marc.almeida@gmail.com';
      let myTickets = this.allTickets.filter((value: Ticket)=>{
        if(value.empEid == 'marc.almeida@gmail.com') return value;
        else return null;
      })
      this.dataSource.data = myTickets;
    }
    else{
      this.searchBoxValue = '';
      this.dataSource.data = this.allTickets;
    }
  }

  timeFilter(){
    // alert('change detected')
    let oneWeekBack = new Date(), oneMonthBack = new Date(), oneYearBack = new Date();
    oneWeekBack.setDate(oneWeekBack.getDate()-7);
    oneMonthBack.setDate(oneMonthBack.getDate()-31);
    oneYearBack.setDate(oneYearBack.getDate()-365);
    // alert(`1w back: ${oneWeekBack} 1m back: ${oneMonthBack} 1y back: ${oneYearBack}`)
    let limitDate: Date;
    if(this.selectedTimePeriod=='week-0') limitDate = oneWeekBack;
    else if(this.selectedTimePeriod=='month-1') limitDate = oneMonthBack;
    else if(this.selectedTimePeriod=='year-2') limitDate = oneYearBack;
    else limitDate = new Date(2000,0,1);
    let count =0;
    let filtered = this.allTickets.filter((ticket: Ticket)=>{
      ticket.issueDate.getTime() >= limitDate.getTime();
    })
    alert(filtered.length);
  }

  createTicket(): void{
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;  // automatically sets focus to first text box
    dialogConfig.width = '52.5%';
    dialogConfig.data = {
      ticketDialogTitle: 'Create',
    }

    const dialogRef = this.dialog.open(TicketDialogComponent, dialogConfig);
  }

  updateTicket(ticket: any){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;  // automatically sets focus to first text box
    dialogConfig.width = '52.5%';
    dialogConfig.data = {
      ticketDialogTitle: 'Update',
      ticket: ticket,
    };

    const dialogRef = this.dialog.open(TicketDialogComponent, dialogConfig);
  }

  deleteTicket(ticket: any){
    if( confirm(`Are you sure you want to delete Ticket ${ticket.tid}?`) ){
      this.ticketService.delete(ticket.key).then(()=>{
        alert("Successfully deleted ticket "+ticket.key)
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

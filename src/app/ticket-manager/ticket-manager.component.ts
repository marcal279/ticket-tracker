import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { isSubscription } from 'rxjs/internal/Subscription';
import { CreateTicketDialogComponent } from '../create-ticket-dialog/create-ticket-dialog.component';
import { Ticket } from '../ticket';

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
  currPage:string = 'Ticket Manager';
  sideNavIconList : string[] = ['severity--v2', 'two-tickets', 'bar-chart'];
  sideNavSectionList: string[] = ['Dashboard', 'Ticket Manager', 'Analytics'];
  
  constructor(public dialog: MatDialog) { }

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
  ]
  selectedTimePeriod = 'week-0';

  ngOnInit(): void {
    this.generateSampleTickets();
  }

  randomIntBelow(ceiling: number){
    return Math.floor(Math.random()*ceiling);
  }

  platformList: String[] = ['LP','LA','SCP','SCA','DCP','DCA','WBS','LAA','DCAA']
  randomTID(){
    let company = Math.random()>0.5?'NXT':'IN';
    let portal = this.platformList[this.randomIntBelow(this.platformList.length)];
    let id = this.randomIntBelow(100);
    return company+portal+id
  }

  departments: String[] = ['Finance','Ops','Legal','Logistics'];
  randomDept(){
    return this.departments[this.randomIntBelow(this.departments.length)].toString();
  }

  sampleTickets: Ticket[] = [];
  generateSampleTickets(){
    for(let i=1; i<=20;i++){
      let newTicket: Ticket = {
        tid: this.randomTID(),
        // empid: Math.random()>0.5?'NXT1234':'NXT9876',
        empid: (Math.random()<0.5?'NXT':'IMCL') + (this.randomIntBelow(2000)+1),
        dept: this.randomDept(),
        title: 'Ticket No. ' + String(50 + i),
        desc: Math.random() > 0.5 ? 'desc' : null,
        status: ['AAPending', 'BBProduction', 'CCTesting', 'DDApproval', 'ZZClosed'][Math.floor(Math.random() * 5)],
        issueDate: new Date().toDateString(),
        duration: String(this.randomIntBelow(3)+1) + 'w',
        expectedDate: null,
        priority: (Math.random()<0.333? 'High': (Math.random()<0.667? 'Medium': 'Low')),
        comments: 'Comment commenting commented',
      }
      let endDate = new Date(newTicket.issueDate);  // has issueDate
      endDate.setDate(endDate.getDate() + Number(newTicket.duration?.slice(0,1))*7);  // has Date form of issueDate + days
      newTicket.expectedDate = endDate.toDateString();
      this.sampleTickets.push(newTicket);
    }
  }

  // String(Math.ceil(Math.random()*3))

  statusIsPending(status: string): boolean{
    if(status == 'AAPending') return true;
    return false;
  }
  statusIsClosed(status: string){
    if(status == 'ZZClosed') return true;
    return false;
  }
  statusIsProcessing(status: string){
    if(!this.statusIsClosed(status) && !this.statusIsPending(status)) return true;
    return false;
  }
  lastIcon: string = 'tick';

  displayedColumns: string[] = ['tid','title', 'empid', 'dept', 'priority', 'issueDate', 'duration','status'];
  colNames: string[] = ['TID', 'Title', 'Employee ID', 'Dept.', 'Priority', 'Issued', 'Duration','Status'];

  dataSource = new MatTableDataSource<Ticket>(this.sampleTickets);
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('ticketPaginator') ticketPaginator !: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.ticketPaginator;
  }

  expandedRow: Ticket|null = null;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createTicket(): void{
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;  // automatically sets focus to first text box
    dialogConfig.width = '35rem';

    const dialogRef = this.dialog.open(CreateTicketDialogComponent, dialogConfig);
  }

}

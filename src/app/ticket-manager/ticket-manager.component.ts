import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { isSubscription } from 'rxjs/internal/Subscription';
import { CreateTicketDialogComponent } from '../create-ticket-dialog/create-ticket-dialog.component';
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

  getTickets(){
    // this.tickets = this.ticketService.getTickets(); synchronous implementation, removed now because we're using asynchronous implem (Observables)
    this.ticketService.getTickets().subscribe(ticketObserver => this.allTickets = ticketObserver)
  }
  
  ngOnInit(): void {
    this.getTickets();  // stored in allTickets
    // alert('called at ngOnInit');
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
  ]
  selectedTimePeriod = 'week-0';

  
  

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

  dataSource = new MatTableDataSource<Ticket>();  // added this.dataSource.data = this.allTickets; below because somehow dataSource doesnt get properly initialized if passed as new MatTableDataSource<Ticket>(this.allTickets);
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('ticketPaginator') ticketPaginator !: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.data = this.allTickets;   // IMP LINE HERE. needed to add this on getting allTickets from observable, see comment just above this
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

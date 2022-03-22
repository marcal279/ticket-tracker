import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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
  constructor() { }

  ngOnInit(): void {
    this.generateSampleTickets();
  }

  randomIntBelow(ceiling: number){
    return Math.floor(Math.random()*ceiling);
  }

  randomTID(){
    let company = Math.random()>0.5?'NXT':'IN';
    let portal ='', portalRandom = Math.random();
    if(portalRandom<0.1) portal ='LP'
    else if(portalRandom<0.2) portal = 'LA'
    else if(portalRandom<0.3) portal = 'SCP'
    else if(portalRandom<0.4) portal = 'SCA'
    else if(portalRandom<0.5) portal = 'DCP'
    else if(portalRandom<0.6) portal = 'DCA'
    else if(portalRandom<0.7) portal = 'WBS'
    else if(portalRandom<0.8) portal = 'LAA'
    else portal = 'DCAA';
    let id = this.randomIntBelow(100);

    return company+portal+id
  }

  randomDept(){
    let randomVal = Math.random();
    return randomVal<0.2?'Finance':( randomVal<0.4?'Ops': (randomVal<0.6?'Legal':'Logistics') );
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
        status: ['AAPending', 'Production', 'Testing', 'Approval', 'ZZClosed'][Math.floor(Math.random() * 5)],
        duration: String(this.randomIntBelow(3)+1) + 'w',
        priority: (Math.random()<0.333? 'High': (Math.random()<0.667? 'Medium': 'Low')),
      }
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

  displayedColumns: string[] = ['tid','title', 'empid', 'dept', 'priority', 'duration','status'];
  colNames: string[] = ['TID', 'Title', 'Employee ID', 'Dept.', 'Priority', 'Duration','Status'];

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

}

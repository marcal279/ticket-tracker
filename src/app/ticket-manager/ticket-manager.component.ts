import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Ticket } from '../ticket';

@Component({
  selector: 'app-ticket-manager',
  templateUrl: './ticket-manager.component.html',
  styleUrls: ['./ticket-manager.component.css']
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

  randomDept(){
    let randomVal = Math.random();
    return randomVal<0.2?'Finance':( randomVal<0.4?'Ops': (randomVal<0.6?'Legal':'Logistics') );
  }


  sampleTickets: Ticket[] = [];
  generateSampleTickets(){
    for(let i=1; i<=20;i++){
      let newTicket: Ticket = {
        tid: String(50 + i),
        // empid: Math.random()>0.5?'NXT1234':'NXT9876',
        empid: (Math.random()<0.5?'NXT':'IMCL') + (this.randomIntBelow(2000)+1),
        dept: this.randomDept(),
        title: 'Ticket No. ' + String(50 + i),
        desc: Math.random() > 0.5 ? 'desc' : null,
        status: ['AAPending', 'Production', 'Testing', 'Approval', 'ZZClosed'][Math.floor(Math.random() * 5)],
        duration: String(this.randomIntBelow(3)+1) + 'w',
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

  displayedColumns: string[] = ['tid','title','desc','empid', 'dept', 'duration','status'];

  dataSource = new MatTableDataSource<Ticket>(this.sampleTickets);
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('ticketPaginator') ticketPaginator !: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.ticketPaginator;
  }



}

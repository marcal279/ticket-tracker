import { Component, OnInit } from '@angular/core';
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

  sampleTickets: Ticket[] = [];
  generateSampleTickets(){
    for(let i=1; i<=5;i++){
      let newTicket: Ticket = {
        tid: String(50 + i),
        // empid: Math.random()>0.5?'NXT1234':'NXT9876',
        empid: 'NXT1234',
        title: 'Ticket No. ' + String(50 + i),
        desc: Math.random() > 0.5 ? 'desc' : null,
        status: ['Pending', 'Production', 'Testing', 'Approval', 'Closed'][Math.floor(Math.random() * 5)],
        duration: String(Math.ceil(Math.random()*3))+'w',
      }
      this.sampleTickets.push(newTicket);
    }
  }
  displayedColumns: string[] = ['tid','title','desc','duration','status'];
  dataSource = this.sampleTickets;


}

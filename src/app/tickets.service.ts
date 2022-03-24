import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Ticket } from './ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

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

  generateRandomTickets(): Ticket[] {
    let randomTickets = [];
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
      randomTickets.push(newTicket);
    }
    return randomTickets
  }

  getTickets(): Observable<Ticket[]>{
    // alert('Reached Ticket Service');
    let TICKETS = this.generateRandomTickets(); // change this source later on
    // alert('Random Tickets Generated')
    const ticketObservable = of(TICKETS); // creates observable object for all the tickets generated and stored in TICKETS
    return ticketObservable;
  }
  constructor() { }
}

import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable, of } from 'rxjs';
import { Ticket } from './ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  randomIntBelow(ceiling: number){
    return Math.floor(Math.random()*ceiling);
  }

  platformList: string[] = ['LP','LA','SCP','SCA','DCP','DCA','WBS','LAA','DCAA']
  
  randomCompany(){
    return Math.random()>0.5?'NXT':'IN'
  }

  randomPlatform(){
    return this.platformList[this.randomIntBelow(this.platformList.length)]
  }

  departments: String[] = ['Finance','Ops','Legal','Logistics'];
  randomDept(){
    return this.departments[this.randomIntBelow(this.departments.length)].toString();
  }

  generateRandomTickets(): Ticket[] {
    let randomTickets = [];
    for(let i=1; i<=20;i++){
      let company = this.randomCompany();
      let platform = this.randomPlatform();
      let id = this.randomIntBelow(100);

      let newTicket: Ticket = {
        tid: company+platform+id,
        company: company,
        platform: platform,
        empEid: 'marc.almeida@gmail.com',
        dept: this.randomDept(),
        title: 'Ticket No. ' + String(50 + i),
        desc: Math.random() > 0.5 ? 'desc': '',
        status: ['AAPending', 'BBProduction', 'CCTesting', 'DDApproval', 'ZZClosed'][Math.floor(Math.random() * 5)],
        issueDate: new Date(),
        duration: String(this.randomIntBelow(3)+1) + 'w',
        expectedDate: new Date(),
        priority: (Math.random()<0.333? 'High': (Math.random()<0.667? 'Medium': 'Low')),
        comments: 'Comment commenting commented',
      }
      let endDate = new Date(newTicket.issueDate);  // has issueDate
      endDate.setDate(endDate.getDate() + Number(newTicket.duration?.slice(0,1))*7);  // has Date form of issueDate + days
      newTicket.expectedDate = endDate;
      randomTickets.push(newTicket);
    }
    //manual ticket we're adding for testing
    let hardCodeTicket: Ticket = {
      tid: 'NXLP1234',
      company: 'NXT Digital',
      platform: 'LCO Portal',
      empEid: 'marc.almeida@gmail.com',
      dept: this.randomDept(),
      title: 'Hard Coded Ticket',
      desc: Math.random() > 0.5 ? 'desc' : '',
      status: ['AAPending', 'BBProduction', 'CATesting', 'CBHold', 'DDApproval', 'ZZClosed'][Math.floor(Math.random() * 5)],
      issueDate: new Date(),
      duration: String(this.randomIntBelow(3)+1) + 'w',
      expectedDate: new Date(),
      priority: (Math.random()<0.333? 'High': (Math.random()<0.667? 'Medium': 'Low')),
      comments: 'Comment commenting commented',
    }
    randomTickets.push(hardCodeTicket);
    return randomTickets
  }

  getTickets(): Observable<Ticket[]>{
    // alert('Reached Ticket Service');
    let TICKETS = this.generateRandomTickets(); // change this source later on
    // alert('Random Tickets Generated')
    const ticketObservable = of(TICKETS); // creates observable object for all the tickets generated and stored in TICKETS
    return ticketObservable;
  }

  // Imp function
  newTicketObject(): Ticket{
    return {
      title: '',
      desc: '',
      tid: '',
      company: '',
      platform: '',
      empEid: 'admin@admin.com',
      dept: 'Tech',
      status: '', // 'AAPending'|'Production'|'Testing'|'Hold'|'Approval'|'ZZClosed',
      issueDate: new Date(),
      duration: '',
      expectedDate: new Date( new Date().setDate(new Date().getDate() + 7) ),
      priority: '',// 'High'|'Medium'|'Low'
      comments: '',
    }
  }


  //Firebase starting here
  ticketsRef!: AngularFireList<Ticket>;

  constructor(private db: AngularFireDatabase) { 
    this.ticketsRef = db.list('/Tickets');
  }

  // C
  createDBTicket(newTicket: Ticket){
    return this.ticketsRef.push(newTicket);
  }

  // R
  readDBTicket(): AngularFireList<Ticket>{
    return this.ticketsRef
  }

  // U
  updateDBTicket(key: string, value: any): Promise<void> {
    return this.ticketsRef.update(key, value);
  }

  // D
  deleteDBTicket(key: string): Promise<void> {
    return this.ticketsRef.remove(key);
  }
  deleteAllDBTickets(): Promise<void> {
    return this.ticketsRef.remove();
  }

}

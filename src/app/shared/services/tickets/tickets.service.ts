import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable, of } from 'rxjs';
import { Ticket } from '../../interfaces/ticket';

@Injectable({
  providedIn: 'root'
})

export class TicketsService {

  TICKET_HEADERS = ['key', 'approvedAmount', 'closedDate', 'company', 'desc',
   'duration', 'empEid','estimatedAmount', 'expectedDate', 'issueDate', 'lastUpdated', 'platform', 'priority',
   'projLead', 'requestedBy', 'status', 'ticketType', 'tid', 'title', 'vendor', 'attachments'
  ]
  ticketHeaders(){
    return this.TICKET_HEADERS;
  }

  randomIntBelow(ceiling: number){
    return Math.floor(Math.random()*ceiling);
  }

  // Imp function
  newTicketObject(set2049 = false): Ticket{
    return {
      key: '',
      ticketType: set2049 ? 'New Requirement' : '',
      title: '',
      desc: '',
      tid: '',
      company: '',
      platform: '',
      requestedBy: { dept: '', requester: '' },
      empEid: 'admin@nxtdigital.in',
      projLead: set2049 ? 'Ru Ediriwira' : 'Thomas John',
      vendor: '',
      status: 'New',
      issueDate: new Date(),
      duration: '',
      expectedDate: set2049 ? new Date(2049,0,1) : new Date( new Date().setDate(new Date().getDate() + 7) ),
      lastUpdated: new Date(),
      priority: '',// 'High'|'Medium'|'Low',
      estimatedAmount: ' ',
      approvedAmount: ' ',
      updateHistory: [],
      zattachments: []
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
  // readSingleTicket(key: String){
  // }

  // U
  updateDBTicket(key: string, value: Ticket): Promise<void> {
    value.key = key;    // !! without this the app fucking crashes, DO NOT remove
    // alert("ticket's key = "+value.key)
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

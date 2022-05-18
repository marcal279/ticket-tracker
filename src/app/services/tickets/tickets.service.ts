import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable, of } from 'rxjs';
import { Ticket } from '../../interfaces/ticket';

@Injectable({
  providedIn: 'root'
})

export class TicketsService {

  TICKET_HEADERS = ['key', 'approvedAmount', 'closedDate', 'company', 'desc',
   'duration', 'empEid', 'expectedDate', 'issueDate', 'lastUpdated', 'platform', 'priority',
   'projLead', 'requestedBy', 'status', 'ticketType', 'tid', 'title', 'vendor', 'attachments'
  ]
  ticketHeaders(){
    return this.TICKET_HEADERS;
  }

  randomIntBelow(ceiling: number){
    return Math.floor(Math.random()*ceiling);
  }

  // Imp function
  newTicketObject(): Ticket{
    return {
      key: '',
      ticketType: '',
      title: '',
      desc: '',
      tid: '',
      company: '',
      platform: '',
      requestedBy: { dept: '', requester: '' },
      empEid: 'admin@admin.com',
      projLead: 'Thomas John',
      vendor: '',
      status: 'New',
      issueDate: new Date(),
      duration: '',
      expectedDate: new Date( new Date().setDate(new Date().getDate() + 7) ),
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

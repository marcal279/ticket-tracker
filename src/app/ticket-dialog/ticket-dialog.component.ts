import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';

import { MatSnackBar } from '@angular/material/snack-bar';

// import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../interfaces/dialog-data';
import { Ticket } from '../interfaces/ticket';

import { TicketsService } from '../services/tickets/tickets.service';
import { Store } from '@ngrx/store';
import { User } from '../interfaces/user';
import { filter, map, Observable, of } from 'rxjs';
import { IncrementIndexAction, StoreIndexAction } from '../ngrx-state/app.actions';
import { Router } from '@angular/router';
import * as TicketParameters from '../parameters/tickets.parameters';

import { MAT_DATE_FORMATS } from '@angular/material/core';

export const CUSTOM_DATE_FORMATS = {
  parse: { dateInput: 'DD/MM/YYYY' },
  display: { 
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateAllyLabel: 'LL',
    monthYearAllyLabel: 'MMMM YYYY'
  }
}

@Component({
  selector: 'app-ticket-dialog',
  templateUrl: './ticket-dialog.component.html',
  styleUrls: ['./ticket-dialog.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ]
})
export class TicketDialogComponent implements OnInit {

  ticketsRef!: AngularFireList<Ticket>;

  ticketTypes = TicketParameters.ticketTypes;
  platformConsolidatedList = TicketParameters.platformConsolidatedList;
  departments = TicketParameters.departments;
  statuses = TicketParameters.statuses;
  priorities = TicketParameters.priorities;
  knownVendors = TicketParameters.knownVendors

  
  newTicket: Ticket = this.ticketService.newTicketObject();
  currentTicket : Ticket = this.newTicket;

  constructor(private ticketService: TicketsService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private db: AngularFireDatabase,
    public matSnack:MatSnackBar,
    private store: Store<{indexReducer: {nextIndex: Number}}>,
    private router: Router) {
      this.ticketsRef = db.list('Tickets')
  }

  allMandatoryFilled(){
    if(this.currentTicket.title == '' || this.currentTicket.priority == '' ||
    this.currentTicket.company == '' || this.currentTicket.platform == '' ||
    this.currentTicket.status == ''){
      return false;
    }
    return true;
  }

  filteredACVendors$ !: Observable<string[]>;
  doAutoCompleteFilter(){
    this.filteredACVendors$ = of(this.knownVendors).pipe(
      map(vendors => this._acFilter(vendors))
    );
  }
  _acFilter(vendors: string[]): string[]{  // ac = autocomplete but this pun was too funny to leave out XD
    return vendors.filter( vendorName => vendorName.toLowerCase().includes(this.currentTicket.vendor.toLowerCase()) )
  }



  generateTID(ticket: Ticket){
    let tid='';   

    if(ticket.company.slice(0,3)=='NXT') tid+='NXT';
    else tid+='IN';

    for(let platform of this.platformConsolidatedList){
      if(ticket.platform==platform.name){
        tid+=platform.code;
        break;
      }
    }
    tid+=this.ngrxNextIndex;
    return tid;
  }

  metaData(ticket: Ticket){
    alert(JSON.stringify(ticket));
    let mandatoryFilled = this.allMandatoryFilled();
  }

  calcDuration(issueDate: Date, expectedDate: Date){
    let diff = Math.abs(new Date(this.currentTicket.expectedDate).getTime() - new Date(this.currentTicket.issueDate).getTime());
    let duration = '';
    if(Math.round(diff/1000/60/60/24/7) < 1) duration = Math.round(diff/1000/60/60/24)+'d';
    else duration = Math.round(diff/1000/60/60/24/7) +'w';
    return duration;
  }

  createTicket(){
    let rightNow = new Date();

    this.currentTicket.tid = this.generateTID(this.currentTicket);
    this.currentTicket.issueDate = rightNow;
    if(this.currentTicket.expectedDate && this.currentTicket.issueDate){
      this.currentTicket.duration = this.calcDuration(this.currentTicket.issueDate, this.currentTicket.expectedDate);
    }
    this.currentTicket.lastUpdated = rightNow;
    if(this.data.currEmail){
      this.currentTicket.empEid = this.data.currEmail;
      this.currentTicket.updateHistory = [{updater: this.data.currEmail, updateDate: rightNow, commitMessage: `Created on ${rightNow.toDateString()} at ${rightNow.toLocaleTimeString()}`}];
    }
    else{
      alert('User not logged in!!');
      this.router.navigate['../']
    }

    this.ticketService.createDBTicket(this.currentTicket).then(()=>{
      this.openSnackBar(`Created TicketID ${this.currentTicket.tid} successfully!`);
      this.ticketService.updateDBTicket(newlyAddedKey, this.currentTicket)  // beacause otherwise date isnt added into ticket
      .then( () => { 
        this.ngrxIncrementIndex();
      }).catch(err => alert(err));
    }).catch(err =>{alert('Error: '+err)});
    
    let newlyAddedKey :any; 
    
    this.ticketsRef.snapshotChanges(['child_added']).subscribe(
      actions=> {actions.slice(-1).forEach(action =>{
        newlyAddedKey = action.key;
        // alert(`Newest key = ${newlyAddedKey}`);
      })
    })
  }

  updateMessage = '';
  updateTicket(ticket: any){
    let rightNow = new Date();

    if(this.currentTicket.expectedDate && this.currentTicket.issueDate){
      this.currentTicket.duration = this.calcDuration(this.currentTicket.issueDate, this.currentTicket.expectedDate);
    }
    this.currentTicket.lastUpdated = rightNow;

    if(!this.updateMessage) this.updateMessage = `Updated by ${this.data.currEmail} on ${rightNow.toDateString()} at ${rightNow.toLocaleTimeString()}`;

    this.currentTicket.updateHistory.push({updater: this.data.currEmail, updateDate: this.currentTicket.lastUpdated, commitMessage: this.updateMessage})

    if(this.currentTicket.status=='Closed') this.currentTicket.closedDate = rightNow;
    if(this.data.ticket.key){
      this.ticketService.updateDBTicket(this.data.ticket.key, this.currentTicket)
      .then( () => {
        this.openSnackBar(`Updated record ${ticket.key} successfully!`);
      })
      .catch(err => alert(err));
    }
  }

  nextStatus: String = '';
  giveNextStatus(status: String){
    let currIndex = this.statuses.findIndex(element => element == status);
    console.log('CurrIndex = '+currIndex)
    if(currIndex == this.statuses.length-1) // if = 'Reopened' 
    {currIndex=1} // next step would be approved, as flow restarted
    this.nextStatus = this.statuses[currIndex+1];  // * Basically would use [currIndex-1 + 1], so comes to same thing
    if(this.nextStatus=='Hold') this.giveNextStatus(this.nextStatus);
  }

  openSnackBar(message: string, action: string = 'Close') {
    this.matSnack.open(message, action);
  }

  ngrxIndexObservable : Observable<{nextIndex: Number}>
  ngrxNextIndex : number;
  ngrxGetIndex(){
    this.ngrxIndexObservable = this.store.select('indexReducer');
    this.ngrxIndexObservable.subscribe(
      observer => {
        this.ngrxNextIndex = +observer.nextIndex;
        console.log('ngrxNextIndex = '+this.ngrxNextIndex)
      }
    )
  }
  ngrxStoreIndex(index:Number){
    this.store.dispatch(new StoreIndexAction(index))
  }
  ngrxIncrementIndex(){
    this.store.dispatch(new IncrementIndexAction(null))
  }

  oldStatus: String = '';
  ngOnInit(): void {
    if(this.data.ticketDialogTitle=='Create'){
      this.currentTicket = this.newTicket;
      this.ngrxGetIndex();
      
      if(this.ngrxNextIndex){
        // alert(`got ngrx index ${this.ngrxNextIndex}, dialog Data ${this.data.nextIndex}`)
        if(this.ngrxNextIndex==1 && this.ngrxNextIndex != this.data.nextIndex){
          this.ngrxStoreIndex(this.data.nextIndex);
          this.ngrxNextIndex = this.data.nextIndex;
        }
      }
      // else alert('no ngrx index')
    }
    else{
      this.currentTicket = {...this.data.ticket};
      this.oldStatus = this.currentTicket.status;
      this.giveNextStatus(this.currentTicket.status);
    }
  }
}

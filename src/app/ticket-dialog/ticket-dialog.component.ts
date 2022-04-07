import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogData } from '../dialog-data';
import { Ticket } from '../ticket';
import { TicketsService } from '../tickets.service';
// import {MatDialog, MatDialogConfig} from '@angular/material/dialog';

@Component({
  selector: 'app-ticket-dialog',
  templateUrl: './ticket-dialog.component.html',
  styleUrls: ['./ticket-dialog.component.css']
})
export class TicketDialogComponent implements OnInit {

  ticketsRef!: AngularFireList<Ticket>;
  constructor(private ticketService: TicketsService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private db: AngularFireDatabase,
    public matSnack:MatSnackBar) {
      this.ticketsRef = db.list('Tickets')
    }

  //consider making list of objects that have like [{code: 'lp', name: 'lco', types:  ['app', 'portal']}, ]
  //downside: could risk messing up platform codes
  platformConsolidatedList = [
    { 'code': 'LP', 'name': 'LCO Portal' },
    { 'code': 'LA', 'name': 'LCO App' },
    { 'code': 'SCP', 'name': 'Selfcare Portal' },
    { 'code': 'SCA', 'name': 'Selfcare App' },
    { 'code': 'DCP', 'name': 'DP Collection Portal' },
    { 'code': 'DCA', 'name': 'DP Collection App' },
    { 'code': 'WBS', 'name': 'Website' },
    { 'code': 'LAA', 'name': 'LCO Admin App' },
    { 'code': 'DCAA', 'name': 'DP Collection Admin' },
  ]
  departments: String[] = ['Finance','Ops','Legal','Logistics'];
  statuses: String[] = ['Pending', 'Production', 'Testing', 'Approval', 'Closed']
  priorities: String[] = ['High','Medium','Low']
  
  newTicket: Ticket ={
    title: '',
    desc: '',
    tid: '',
    company: '',
    platform: '',
    // empid: '',
    empid: 'NXT1234',
    // dept: '',
    dept: 'Tech',
    status: '', // 'AAPending'|'Production'|'Testing'|'Approval'|'ZZClosed',
    issueDate: new Date(),
    duration: '',
    expectedDate: new Date( new Date().setDate(new Date().getDate() + 7) ),
    priority: '',// 'High'|'Medium'|'Low'
    comments: '',
  }
  currentTicket : Ticket = this.newTicket;

  ngOnInit(): void {
    if(this.data.ticketDialogTitle=='Create') this.currentTicket = this.newTicket;
    else this.currentTicket = {...this.data.ticket};
  }

  allMandatoryFilled(){
    return true;
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

    //change this bit later
    tid+=Math.ceil(Math.random()*999)

    return tid;
  }

  metaData(ticket: Ticket){
    alert(JSON.stringify(ticket));
  }

  calcDuration(issueDate: Date, expectedDate: Date){
    let diff = Math.abs(new Date(this.currentTicket.expectedDate).getTime() - new Date(this.currentTicket.issueDate).getTime());
    let duration = '';
    if(Math.round(diff/1000/60/60/24/7) < 1) duration = Math.round(diff/1000/60/60/24)+'d';
    else duration = Math.round(diff/1000/60/60/24/7) +'w';
    return duration;
  }

  createTicket(){
    if( this.allMandatoryFilled() ){  // double check
      this.currentTicket.tid = this.generateTID(this.currentTicket);
      this.currentTicket.issueDate = new Date();
      if(this.currentTicket.expectedDate && this.currentTicket.issueDate){
        this.currentTicket.duration = this.calcDuration(this.currentTicket.issueDate, this.currentTicket.expectedDate);
      }
      this.ticketService.create(this.currentTicket).then(()=>{
        // alert(`Created TicketID ${this.currentTicket.tid} successfully!`);
        this.openSnackBar(`Created TicketID ${this.currentTicket.tid} successfully!`);
        this.ticketService.update(newlyAddedKey, this.currentTicket)
        .then( () => { 
          // alert('Added dates') 
        }).catch(err => alert(err));
      }).catch(err =>{alert('Error: '+err)});
      
      let newlyAddedKey :any; 
      
      this.ticketsRef.snapshotChanges(['child_added']).subscribe(
        actions=> {actions.slice(-1).forEach(action =>{
          newlyAddedKey = action.key;
          // alert(`Newest key = ${newlyAddedKey}`);
        })
      })

      
      // this.resetTicketDialogBox();
    }
  }

  updateTicket(ticket: any){
    if(this.allMandatoryFilled()){
      if(this.currentTicket.expectedDate && this.currentTicket.issueDate){
        // alert( `Issue Date ${this.currentTicket.issueDate} expected Date ${this.currentTicket.expectedDate} 
        // diff ${this.calcDuration(this.currentTicket.issueDate, this.currentTicket.expectedDate)}` );
        this.currentTicket.duration = this.calcDuration(this.currentTicket.issueDate, this.currentTicket.expectedDate);
      }
      else alert('Nope')
      if(this.data.ticket.key){
        this.ticketService.update(this.data.ticket.key, this.currentTicket)
        .then( () => {
          // alert('Updated record '+ticket.key+' successfully!')
          this.openSnackBar(`Updated record ${ticket.key} successfully!`);
        })
        .catch(err => alert(err));
      }
    }
  }

  openSnackBar(message: string, action: string = 'Close') {
    this.matSnack.open(message, action);
  }
}

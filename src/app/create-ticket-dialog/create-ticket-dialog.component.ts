import { Component, OnInit } from '@angular/core';
import { Ticket } from '../ticket';
import { TicketsService } from '../tickets.service';
// import {MatDialog, MatDialogConfig} from '@angular/material/dialog';

@Component({
  selector: 'app-create-ticket-dialog',
  templateUrl: './create-ticket-dialog.component.html',
  styleUrls: ['./create-ticket-dialog.component.css']
})
export class CreateTicketDialogComponent implements OnInit {

  constructor(private ticketService: TicketsService) { }

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
    duration: Math.ceil(Math.random()*6)+'w',
    expectedDate: null,
    priority: '',// 'High'|'Medium'|'Low'
    comments: '',
  }
  currentTicket : Ticket = this.newTicket;

  ngOnInit(): void {
   this.currentTicket = this.newTicket;
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

  createTicket(){
    if( this.allMandatoryFilled() ){  // double check
      this.currentTicket.tid = this.generateTID(this.currentTicket);
      this.currentTicket.issueDate = new Date();
      this.ticketService.create(this.currentTicket).then(()=>{
        alert(`Created TicketID ${this.currentTicket.tid} successfully!`);
        // this.openSnackBar('Created Ticket Successfully!!');
      }).catch(err =>{alert('Error: '+err)});

      // this.resetTicketDialogBox();
    }
  }
}

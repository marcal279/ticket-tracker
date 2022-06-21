import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';

import { MatSnackBar } from '@angular/material/snack-bar';

// import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
// import { MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { DialogData } from '../../shared/interfaces/dialog-data';
import { Ticket } from '../../shared/interfaces/ticket';

import { TicketsService } from '../../shared/services/tickets/tickets.service';
import { Store } from '@ngrx/store';
import { User } from '../../shared/interfaces/user';
import { filter, map, Observable, of } from 'rxjs';
import { IncrementIndexAction, StoreIndexAction } from '../../shared/ngrx-state/app.actions';
import { Router } from '@angular/router';
import * as TicketParameters from '../../shared/parameters/tickets.parameters';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import { CUSTOM_DATE_FORMATS } from '../report-generator/report-generator.component';
import * as moment from 'moment';

@Component({
  selector: 'app-bulk-import',
  templateUrl: './bulk-import.component.html',
  styleUrls: ['./bulk-import.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ]
})


export class BulkImportComponent implements OnInit {

  ticketsRef!: AngularFireList<Ticket>;

  ticketTypes = TicketParameters.ticketTypes;
  platformConsolidatedList = TicketParameters.platformConsolidatedList;
  departments = TicketParameters.departments;
  statuses = TicketParameters.statuses;
  priorities = TicketParameters.priorities;
  knownVendors = TicketParameters.knownVendors

  
  newTicket: Ticket = this.ticketService.newTicketObject(true); // 2049 created
  currentTicket : Ticket = this.newTicket;

  bulkActive: boolean = true;

  constructor(private ticketService: TicketsService,
    // @Inject(MAT_DIALOG_DATA) public data: DialogData,
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



  generateTID(ticket: Ticket, index:Number = 0){
    let tid='';   

    if(ticket.company.slice(0,3)=='NXT') tid+='NXT';
    else tid+='IN';

    for(let platform of this.platformConsolidatedList){
      if(ticket.platform==platform.name){
        tid+=platform.code;
        break;
      }
    }
    tid+= index==0 ? this.ngrxNextIndex: index;
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

  index = 1;
  createTicket(){
    let rightNow = new Date();

    this.currentTicket.issueDate = moment(this.currentTicket.issueDate).toDate() // * see https://stackoverflow.com/questions/62665005/getting-error-while-using-firebase-in-react-for-using-update-function#:~:text=thanks%20for%20your%20answer%2C%20error%20was%20for%20at%20property%20because%20it%20was%20returned%20from%20moment%20package%2C%20so%20i%20use%20moment(at).valueOf()
    this.currentTicket.expectedDate = moment(this.currentTicket.expectedDate).toDate() // * see https://stackoverflow.com/questions/62665005/getting-error-while-using-firebase-in-react-for-using-update-function#:~:text=thanks%20for%20your%20answer%2C%20error%20was%20for%20at%20property%20because%20it%20was%20returned%20from%20moment%20package%2C%20so%20i%20use%20moment(at).valueOf()

    this.currentTicket.tid = this.generateTID(this.currentTicket, this.index+1);


    // if(this.currentTicket.expectedDate && this.currentTicket.issueDate){
    //   this.currentTicket.duration = this.calcDuration(this.currentTicket.issueDate, this.currentTicket.expectedDate);
    // }
    this.currentTicket.duration = '-'
    this.currentTicket.lastUpdated = rightNow;
    // if(this.data.currEmail){
    //   // this.currentTicket.empEid = this.data.currEmail; got a box for this too
    //   this.currentTicket.updateHistory = [{updater: this.data.currEmail, updateDate: rightNow, commitMessage: `${this.data.currEmail} (${rightNow.toDateString()}, ${rightNow.toLocaleTimeString()}): Created ticket ${this.currentTicket.tid}`}];
    // }
    // else{
    //   alert('User not logged in!!');
    //   this.router.navigate['../']
    // }

    this.ticketService.createDBTicket(this.currentTicket).then(()=>{
      this.openSnackBar(`Created TicketID ${this.currentTicket.tid} successfully!`);
      this.ticketService.updateDBTicket(newlyAddedKey, this.currentTicket)  // beacause otherwise date isnt added into ticket
      .then( () => { 
        // this.ngrxIncrementIndex();
        this.index++;
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

    this.currentTicket.expectedDate = moment(this.currentTicket.expectedDate).toDate() // * see https://stackoverflow.com/questions/62665005/getting-error-while-using-firebase-in-react-for-using-update-function#:~:text=thanks%20for%20your%20answer%2C%20error%20was%20for%20at%20property%20because%20it%20was%20returned%20from%20moment%20package%2C%20so%20i%20use%20moment(at).valueOf()

    if(this.currentTicket.expectedDate && this.currentTicket.issueDate){
      this.currentTicket.duration = this.calcDuration(this.currentTicket.issueDate, this.currentTicket.expectedDate);
    }
    this.currentTicket.lastUpdated = rightNow;

    // if(!this.updateMessage) this.updateMessage = `Updated by ${this.data.currEmail} on ${rightNow.toDateString()} at ${rightNow.toLocaleTimeString()}`;
    if(!this.updateMessage) this.updateMessage = `${this.currentTicket.empEid} (${rightNow.toDateString()}, ${rightNow.toLocaleTimeString()}): Updated by ${this.currentTicket.empEid}`;
    else this.updateMessage = `${this.currentTicket.empEid} (${rightNow.toDateString()}, ${rightNow.toLocaleTimeString()}): `+this.updateMessage;

    this.currentTicket.updateHistory.push({updater: this.currentTicket.empEid, updateDate: rightNow, commitMessage: this.updateMessage})

    if(this.currentTicket.status=='Closed') this.currentTicket.closedDate = rightNow;
    if(ticket.key){
      this.ticketService.updateDBTicket(ticket.key, this.currentTicket)
      .then( () => {
        this.openSnackBar(`Updated record ${ticket.key} successfully!`);
      })
      .catch(err => alert(err));
    }
    else{
      this.openSnackBar('Ticket key not there');
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

  ngOnInit(): void {
    this.currentTicket = this.newTicket;
    this.ngrxGetIndex();
    
    if(this.ngrxNextIndex){
      //!! commented below 3 lines, check please 
      // if(this.ngrxNextIndex==1 && this.ngrxNextIndex != this.data.nextIndex){
      //   this.ngrxStoreIndex(this.data.nextIndex);
      //   this.ngrxNextIndex = this.data.nextIndex;
      // }
    }
    // else alert('no ngrx index')
  }


  toggleBulk(){ this.bulkActive = !this.bulkActive }

  selectedFiles: FileList;
  selectFile(event: any){
    this.selectedFiles = event.target.files;
  }

  csvLines: string[] = [];

  uploadBulkCSV(){
    if(this.selectedFiles){
      const file = this.selectedFiles.item(0);
      if(file){
        let fileReader : FileReader = new FileReader();
        fileReader.readAsText(file);

        // fileReader.onloadstart = () => {alert('Started load')}
        fileReader.onloadend = () => {alert('Finished load')}
        
        fileReader.onload = () => {
          let fullCSV: any = fileReader.result;
          this.csvLines = fullCSV.split('\r\n');
          console.log(this.csvLines.slice(0,3))

          // * everything has to come here, otherwise sync printing takes places
          console.log('printing')
          let headers = this.csvLines[0].split(',')
          console.log('Headers: ',headers);

          this.csvLines.slice(1).forEach((element,index) => {
            // console.log(element)
            // let ticketText = element.slice(1,-1).split('","');  // to deal with " tags at start and end
            let ticketText = element.split(',');  // excel doesnt put those " in csv
            
            this.bulkCreateTicket(ticketText, index); //* LOOK HERE DUMBASS
          });

        }
        // !! DONT PUT ANYTHING HERE, PUT ABOVE 

      }
    }
  }

  creationLog: string[] = [];

  bulkCreateTicket(ticketText: string[], index: number){
    let set2049 = true;
    let ticketObject : Ticket = this.ticketService.newTicketObject(set2049);
            
    //[
    //   ticket.tid, ticket.title, ticket.desc, ticket.ticketType, ticket.priority, ticket.company, ticket.platform, ticket.status, 
    //   ticket.empEid, ticket.projLead, requestedBy, String(ticket.vendor),
    //   ticket.issueDate, ticket.expectedDate, closed, ticket.lastUpdated,
    //   String(ticket.estimatedAmount), String(ticket.approvedAmount)
    // ]


    // instead of below could use array with title,desc,etc. words and then use it as ticketObject[element]
    
    // ticketText[0] is tid, which we're generating below
    ticketObject.title = ticketText[1]; ticketObject.desc = ticketText[2];
    ticketObject.ticketType = ticketText[3]; ticketObject.priority = ticketText[4];
    ticketObject.company = ticketText[5]; ticketObject.platform = ticketText[6];
    ticketObject.status = ticketText[7]; ticketObject.empEid = ticketText[8];
    ticketObject.projLead = ticketText[9]; // 10 requestedBy is not there in old tickets
    ticketObject.vendor = ticketText[11]; // vendor not there, but f it
                                          ticketObject.issueDate = new Date(ticketText[12]);
    //  expectedDate and closedDate put condition below
    ticketObject.lastUpdated = new Date(ticketText[15]); ticketObject.estimatedAmount = ticketText[16];
    //!!  ticketObject.approvedAmount = ticketText[17]; only if status is approved it works, so f it 

    // ticketObject.updateHistory = [{updater: ticketObject.empEid, updateDate: ticketObject.lastUpdated, commitMessage: `${ticketObject.empEid}(${ticketObject.lastUpdated}, ${ticketObject.lastUpdated.toLocaleTimeString()}): Last updated by ${ticketObject.empEid}`}]
    ticketObject.updateHistory = [{updater: ticketObject.empEid, updateDate: new Date(), commitMessage: `Imported into OTS on ${new Date()}`}]
    
    ticketObject.tid = this.generateTID(ticketObject, index+1);

    if(ticketText[13]!='NA') ticketObject.expectedDate = new Date(ticketText[13]); //!! This has to change. Either set to reaaaallly old date or reaaallly future date (rec. 2049) or manually put in expected dates 
    // else ticketObject.expectedDate = new Date(2049,0,1); set in creating new object

    if(ticketText[14]!='NA') ticketObject.closedDate = new Date(ticketText[14]);

    console.log(ticketObject);

    this.ticketService.createDBTicket(ticketObject).then(()=>{
      // this.openSnackBar(`Created TicketID ${ticketObject.tid} successfully!`);

      this.creationLog.push('Created TicketID '+ticketObject.tid+' successfully!:\n'+JSON.stringify(ticketObject, null, '\t'));
      
    }).catch(err =>{alert('Error: '+err)});

    let newlyAddedKey :any; 
    
    this.ticketsRef.snapshotChanges(['child_added']).subscribe(
      actions=> {actions.slice(-1).forEach(action =>{
        newlyAddedKey = action.key;
        // alert(`Newest key = ${newlyAddedKey}`);
        this.ticketService.updateDBTicket(newlyAddedKey, ticketObject)  // beacause otherwise date & KEY isnt added into ticket
        .then(() => {}).catch(err => alert(err));
      })
    })
  }

}


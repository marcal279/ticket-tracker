import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

// Table
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable } from 'rxjs';

import { TicketDialogComponent } from '../ticket-dialog/ticket-dialog.component';
import { Ticket } from '../interfaces/ticket';
import { TicketsService } from '../services/tickets/tickets.service';
import { StateDataService } from '../services/state-data/state-data.service';
import { User } from '../interfaces/user';
import { Store } from '@ngrx/store';

import * as TicketParameters from '../parameters/tickets.parameters'
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth/user-auth.service';
import { UserService } from '../services/users/user.service';
import { UserAction } from '../ngrx-state/app.actions';


@Component({
  selector: 'app-ticket-manager',
  templateUrl: './ticket-manager.component.html',
  styleUrls: ['./ticket-manager.component.css'],
  animations: [
    trigger('detailExpand', [ // to expand row
      state('collapsed', style({height: '0px', minHeight: '0px'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class TicketManagerComponent implements OnInit {
  currPage:string = 'Ticket Manager';
  allTickets: Ticket[] = [];  // will store Tickets generated from service that were passed here by Observable
  currUser!: User;

  issueTimeOptions = [
    {
      value: 'week-0',
      viewValue: 'Last Week',
    },
    {
      value: 'month-1',
      viewValue: 'Last Month',
    },
    {
      value: 'year-2',
      viewValue: 'Last Year',
    },
    {
      value: 'all-3',
      viewValue: 'Any Time',
    },
  ]
  selectedIssueTimePeriod = 'all-3';
  
  expectedTimeOptions = [
    {
      value: 'nweek-0',
      viewValue: 'In A Week',
    },
    {
      value: 'nmonth-1',
      viewValue: 'In A Month',
    },
    {
      value: 'nyear-2',
      viewValue: 'In A Year',
    },
    {
      value: 'nall-3',
      viewValue: 'Any Time',
    },
  ]
  selectedExpectedTimePeriod = 'nall-3';

  // table
  displayedColumns: string[] = ['ticketType','tid','title','company','platform','empEid','priority','duration','expectedDate','status'];
  colNames: string[] = ['Type', 'TID', 'Title', 'Company', 'Platform', 'Raised By', 'Priority', 'Duration', 'Expected On', 'Status'];

  // Values shown in dropdown
  ticketTypes = TicketParameters.ticketTypes;
  priorities = TicketParameters.priorities;
  platforms = TicketParameters.platformConsolidatedList;
  companies = TicketParameters.companies;
  statuses = TicketParameters.statuses;

  filterForm !: FormGroup;
  filteredTickets: Ticket[] = [];

  dataSource = new MatTableDataSource<Ticket>();  // added this.dataSource.data = observer above in retrieveTickets()
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('ticketPaginator') ticketPaginator !: MatPaginator;

  expandedRow: Ticket|null = null;


  constructor(public dialog: MatDialog, private ticketService: TicketsService, public matSnack: MatSnackBar,
    private stateData: StateDataService,
    private store: Store<{userReducer: {currUser: User}}>,
    public formBuilder: FormBuilder,
    private router: Router,

    // just in case unverified
    private authService: UserAuthService,
    private userService: UserService) {
      this.filterForm = formBuilder.group({
        ticketFilter: formBuilder.group({
          ticketType: 'All',
          priority: 'All',
          company: 'All',
          platform: 'All',
          status: 'All'
        })
      });
  }

  goToDetails(key: string){
    this.router.navigate([`/ticket/${key}`]);
  }

  getAllOptions(param: string){  // used in below functions
    switch(param){
      case 'ticketType':
        return this.ticketTypes;
      case 'priority':
        return this.priorities;
      case 'company':
        return this.companies;
      case 'platform':
        return this.platforms.map(platform => platform.name);
      case 'status':
        return this.statuses;
      default: 
        return [];
    }
  }

  tossleEachOne(param: string){
    let paramListControl = this.filterForm.get(['ticketFilter',param]);
    if(paramListControl.value.includes('All')) {
      // alert(paramListControl.value)
      let allIndex = paramListControl.value.indexOf('All');
      let copyParams = [...paramListControl.value];
      copyParams.splice(allIndex,1)   // * beacuse we cant do patchValue(value.splice) because splice returns DELETED elements
      paramListControl.patchValue(copyParams);
    }
    else{
      let allOptions = this.getAllOptions(param);
      if(paramListControl.value.length == allOptions.length) paramListControl.patchValue([...allOptions, 'All'])
    }
  }
  
  toggleAllSelected(param:string, allSelected: Boolean){  
    //* See https://stackoverflow.com/questions/51580095/select-all-mat-option-and-deselect-all
    let paramListControl = this.filterForm.get(['ticketFilter',param]);
    let allOptions = this.getAllOptions(param);
    if(allSelected) paramListControl.patchValue([...allOptions, 'All']);
    else paramListControl.patchValue([]);
  }

  matchesFilters(ticket:Ticket){
    console.log(this.filterForm)
    // todo Remove this from here. These values initilaized for EVERY TICKET and makes complicated frontside. Not good 
    let filterTicketTypes = this.filterForm.get(['ticketFilter','ticketType'])?.value
    let filterPriorities = this.filterForm.get(['ticketFilter','priority'])?.value
    let filterCompanies = this.filterForm.get(['ticketFilter','company'])?.value
    let filterPlatforms = this.filterForm.get(['ticketFilter','platform'])?.value
    let filterStatuses = this.filterForm.get(['ticketFilter','status'])?.value
    
    if( filterTicketTypes.includes(ticket.ticketType) && filterPriorities.includes(ticket.priority)
     && filterCompanies.includes(ticket.company) && filterPlatforms.includes(ticket.platform)
     && filterStatuses.includes(ticket.status) ) return true;
    
    return false;
    // alert(this.filterForm.value.ticketFilter.ticketType)
    // console.log(this.filterForm.value.ticketFilter.ticketType)
  }
  
  applyFilters(){
    this.filteredTickets = this.allTickets.filter((ticket)=>{
      if(this.matchesFilters(ticket)) return ticket;
      else return null;
    });
    this.dataSource.data = this.filteredTickets;
  }

  resetFilterForm(){
    //because the reactive forms .reset() function isnt working
    let params = ['ticketType','priority','company','platform','status']
    params.forEach((param)=>{
      this.toggleAllSelected(param,true);
    })

    this.onlyMyTicketsShown = false;
    this.onlyOverdue = false;
  }
  clearFilters(){
    this.retrieveTickets();
    this.resetFilterForm();
  }

  // metaData(ticket: Ticket){
  //   alert(JSON.stringify(ticket.closedDate));
  // }

  
  openSnackBar(message: string, action: string = 'Close') {
    this.matSnack.open(message, action);
  }

  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



  retrieveTickets(){ // from db, see below explanantion
    this.ticketService.readDBTicket().snapshotChanges().pipe(
      map(changes =>changes.map( (c: { payload: { key: any; val: () => any; }; })=>
      ({ key: c.payload.key, ...c.payload.val() }) )
      )
    ).subscribe(observer => {
      this.dataSource.data = observer.reverse();  // to give latest tickets first
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.ticketPaginator;

      this.allTickets = observer.reverse();   // original order, allTickets is extra assigning for nextIndex
      console.log(this.allTickets);
    });
  }
  //* SnapshotChanges explanation: 
  //* 1. https://github.com/angular/angularfire/blob/master/docs/firestore/collections.md#streaming-collection-data
  //* 2. https://stackoverflow.com/questions/48608769/what-is-snapshotchanges-in-firestore#:~:text=It%20is%20current,data%20from%20it.



  statusIsNew(status: string): boolean{
    if(status.endsWith('New')) return true; // handles AAPending and Pending
    return false;
  }
  statusIsClosed(status: string){
    if(status.endsWith('Closed')) return true;
    return false;
  }
  statusIsHold(status: string){
    if(status.endsWith('Hold')) return true;
    return false;
  }
  statusIsProcessing(status: string){
    if(!this.statusIsClosed(status) && !this.statusIsNew(status) && !this.statusIsHold(status)) return true;
    return false;
  }
  lastIcon: string = 'tick';
  giveStatusIcon(status: string){
    return this.statusIsClosed(status)? 'done' : ( this.statusIsNew(status) ? 'schedule' : ( this.statusIsHold(status) ? 'pause_circle' : 'construction' ) )
  }
  
  giveTypeIcon(type: string){
    switch(type){
      case 'New Requirement': return 'add_circle';
      case 'Enhancements': return 'tips_and_updates';
      case 'Bugs': return 'bug_report';
      case 'Others': return 'label_important';
      default: return 'dangerous'
    }
  }

  isOverdue(element: Ticket){
    let expected = new Date(element.expectedDate).getTime();
    let today = new Date().getTime();    
    if(expected < today && !this.statusIsClosed(element.status)) return true;
    return false;
  }



  // only my tickets toggle
  searchBoxValue: string = '';
  onlyMyTicketsShown = false;
  @ViewChild('ticketSearch') searchBox!: ElementRef;
  
  oldData: Ticket[] = [];
  myTickets(event: MatSlideToggleChange): void{
    // console.log('Mine '+this.onlyMyTicketsShown);
    if(this.onlyMyTicketsShown){
      this.oldData = [...this.dataSource.data];
      this.searchBoxValue = this.currUser.empEid;
      let myTickets = this.oldData.filter((value: Ticket)=>{
        if(value.empEid == this.currUser.empEid) return value;
        else return null;
      })
      this.dataSource.data = myTickets;
    }
    else{
      this.searchBoxValue = '';
      this.dataSource.data = this.oldData;
      this.oldData = [];
    }
  }

  // overdue toggle
  onlyOverdue = false;
  overdueTickets(event: MatSlideToggleChange): void{
    if(this.onlyOverdue){
      this.oldData = [...this.dataSource.data];
      let myTickets = this.oldData.filter((value: Ticket)=>{
        if(this.isOverdue(value)) return value;
        else return null;
      })
      this.dataSource.data = myTickets;
    }
    else{
      this.searchBoxValue = '';
      this.dataSource.data = this.oldData;
      this.oldData = [];
    }
  }


  // time filters
  issueTimeFilter(){
    // alert('change detected')
    let oneWeekBack = new Date(), oneMonthBack = new Date(), oneYearBack = new Date();
    let oneWeekLater = new Date(), oneMonthLater = new Date(), oneYearLater = new Date();
    oneWeekBack.setDate(oneWeekBack.getDate()-7);
    oneMonthBack.setDate(oneMonthBack.getDate()-31);
    oneYearBack.setDate(oneYearBack.getDate()-365);

    oneWeekLater.setDate(oneWeekLater.getDate()+7);
    oneMonthLater.setDate(oneMonthLater.getDate()+31);
    oneYearLater.setDate(oneYearLater.getDate()+365);
    // alert(`1w back: ${oneWeekBack} 1m back: ${oneMonthBack} 1y back: ${oneYearBack}`)

    let issueLimitDate: Date;
    if(this.selectedIssueTimePeriod=='week-0') issueLimitDate = oneWeekBack;
    else if(this.selectedIssueTimePeriod=='month-1') issueLimitDate = oneMonthBack;
    else if(this.selectedIssueTimePeriod=='year-2') issueLimitDate = oneYearBack;
    else issueLimitDate = new Date(1980,0,1);
    
    let expectedLimitDate: Date;
    if(this.selectedExpectedTimePeriod=='nweek-0') expectedLimitDate = oneWeekLater;
    else if(this.selectedExpectedTimePeriod=='nmonth-1') expectedLimitDate = oneMonthLater;
    else if(this.selectedExpectedTimePeriod=='nyear-2') expectedLimitDate = oneYearLater;
    else expectedLimitDate = new Date(2050,0,1);

    let count = 0;
    let filtered = this.allTickets.filter((ticket: Ticket)=>{
      let tickIssue = new Date(ticket.issueDate).getTime();
      let tickExpected = new Date(ticket.expectedDate).getTime();
      if(issueLimitDate.getTime() <= tickIssue && tickExpected <= expectedLimitDate.getTime() ) return ticket;
      else return null;
    })
    this.dataSource.data = filtered;
  }

  getIndex(fromTicket: Ticket): Number{
    let numPattern = /[0-9]/g;
    return Number(fromTicket.tid.match(numPattern).join(''))
  }

  currUID: string;
  getAuthUser(){
    // console.log('getting AuthUser at '+(new Date()).toLocaleTimeString())
    this.currUID = this.authService.currentUserUID();
    if(this.currUID){
      // console.log('uid = '+this.currUID)
      this.userService.readDBsingleUser(this.currUID).subscribe((response) => {this.currUser = response as User});
      // console.log('User details from dashboard: ',this.currUser)
      sessionStorage.setItem('initialized', '1');
      // this.isAuthenticated = true;
      // console.log('Authenticated here')
    }
    else {alert('ERROR: User not signed in, please sign in again')}
  }
  ngrxStoreUser(){
    this.store.dispatch(new UserAction(this.currUser))
  }


  //* Ticket CUD, R above in retrieveTickets()
  createTicket(): void{
    if(!this.currUser.empEid){
      alert('Fetching user details, please try again in 5 seconds');
      this.getAuthUser();
      this.ngrxStoreUser();
    }

    else{
      const dialogConfig = new MatDialogConfig();

      dialogConfig.autoFocus = false;  // doesn't automatically set focus to first text box
      // dialogConfig.width = '52.5%';
      dialogConfig.width = '46rem';
      dialogConfig.data = {
        ticketDialogTitle: 'Create',
        nextIndex: this.allTickets.slice(-1)[0] ? (+this.getIndex(this.allTickets.slice(-1)[0]) + 1) : 1,
        currEmail: this.currUser.empEid
      }

      const dialogRef = this.dialog.open(TicketDialogComponent, dialogConfig);
    }
  }

  updateTicket(ticket: any){
    if(!this.currUser.empEid){
      alert('Fetching user details, please try again in 5 seconds');
      this.getAuthUser();
      this.ngrxStoreUser();
    }

    else{
      const dialogConfig = new MatDialogConfig();

      dialogConfig.autoFocus = false;  // doesn't automatically set focus to first text box
      dialogConfig.width = '46rem';
      dialogConfig.data = {
        ticketDialogTitle: 'Update',
        ticket: ticket,
        currEmail: this.currUser.empEid
      };

      const dialogRef = this.dialog.open(TicketDialogComponent, dialogConfig);
    }
  }

  isAdmin(email:string){
    if(email == 'marc.almeida.work@gmail.com' || 
    email == 'thomas.john@nxtdigital.in' || email == 'tanuja.gujare@nxtdigital.in') return true;
    return false;
  }

  deleteTicket(ticket: any){
    if( confirm(`Are you sure you want to delete Ticket ${ticket.tid}?`) ){
      this.ticketService.deleteDBTicket(ticket.key).then(()=>{
        this.openSnackBar("Successfully deleted ticket "+ticket.key)
      }).catch(err=>alert("ERROR: "+err))
    }
  }


  downloadCSV(){
    let ticketsCSV = [];
    let ticketHeaders = this.ticketService.TICKET_HEADERS;
    ticketsCSV.push(ticketHeaders.join(","));
    this.allTickets.forEach((ticket, index)=>{
      let row = ""
      console.log(index,'Closed Date: '+ticket.closedDate)
      if(String(ticket.closedDate) != "undefined" ) {
        console.log('yes CD for '+ticket.closedDate)
        if(ticket.zattachments) row = `"${Object.values(ticket).slice(0,-1).join('","') + JSON.stringify(ticket.zattachments)}"`;
        else row = `"${Object.values(ticket).join('","')}",""`
      }
      else{
        console.log('No CD for '+ticket.closedDate)
        let cDIndex = ticketHeaders.indexOf('closedDate')
        let beforeCD = `"${Object.values(ticket).slice(0,cDIndex).join('","')}"`
        let CD = ',"",';

        let afterCD = '', attachments = '';
        if(ticket.zattachments){
          afterCD = `"${Object.values(ticket).slice(cDIndex,-1).join('","')}"`
          attachments = `,"${JSON.stringify(ticket.zattachments)}"`
        }
        else{
          afterCD = `"${Object.values(ticket).slice(cDIndex).join('","')}",""`
        }
        row = beforeCD + CD + afterCD + attachments
      }
      console.log(row)
      ticketsCSV.push(row);
    })
    let finalCSVcontent = ticketsCSV.join("\r\n");

    // * Source: https://code-boxx.com/javascript-export-array-csv/
    let cb = new Blob([finalCSVcontent],{type: "text/csv"});
    var url = window.URL.createObjectURL(cb);
    var anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "tickets.csv";
    anchor.click();
    window.URL.revokeObjectURL(url);
    anchor.remove()
  }

  rxjsGetCurrentUser(){
    this.stateData.currentUser.forEach((user)=> {
      // alert('rxjs sends '+JSON.stringify(user));
      this.currUser = user;
    })
  }

  ngrxUserObservable: Observable<{currUser: User}>;
  ngrxCurrUser: User;
  ngrxGetUser(){
    this.ngrxUserObservable = this.store.select('userReducer');
    this.ngrxUserObservable.subscribe(observer => {
      // this.ngrxCurrUser = ngrxUser.currUser;
      // console.log(this.ngrxCurrUser);
      this.currUser = observer.currUser;
      console.log(this.currUser);
    })
  }

  ngOnInit(): void {
    this.retrieveTickets();
    this.resetFilterForm();
    
    this.ngrxGetUser();
  }
}
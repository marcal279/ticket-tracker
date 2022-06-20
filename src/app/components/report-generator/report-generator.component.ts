import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { filter, map, Observable } from 'rxjs';
import { Ticket } from '../../shared/interfaces/ticket';
import { User } from '../../shared/interfaces/user';
import { MonthsList } from '../../shared/parameters/reports.parameters';
import * as TicketParameters from '../../shared/parameters/tickets.parameters';
import { StateDataService } from '../../shared/services/state-data/state-data.service';
import { TicketsService } from '../../shared/services/tickets/tickets.service';

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
  selector: 'app-report-generator',
  templateUrl: './report-generator.component.html',
  styleUrls: ['./report-generator.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ]
})
export class ReportGeneratorComponent implements OnInit {
  currPage = 'Report Generator';
  currUser!: User;

  chosenYear = 2022;
  Months = MonthsList;

  // Values shown in dropdown
  ticketTypes = TicketParameters.ticketTypes;
  priorities = TicketParameters.priorities;
  platforms = TicketParameters.platformConsolidatedList;
  companies = TicketParameters.companies;
  statuses = TicketParameters.statuses;

  filterForm !: FormGroup;

  allTickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];

  generated: Boolean = false;

  constructor(public formBuilder: FormBuilder, private ticketService: TicketsService,
    private stateData: StateDataService, 
    private store: Store< {userReducer: {currUser: User}} > ){
    this.filterForm = formBuilder.group({
      timeFilter: formBuilder.group({
        // year: '',
        startDate: '',
        endDate: ''
      }),
      ticketFilter: formBuilder.group({
        ticketType: '',
        priority: '',
        company: '',
        platform: '',
        status: ''
      })
    });
  }

  retrieveTickets(){
    this.ticketService.readDBTicket().snapshotChanges().pipe(
      map(changes => changes.map((c: { payload: { key: any; val: () => any; }; }) => ({ key: c.payload.key, ...c.payload.val() }) ) )
    ).subscribe(
      observer =>{
        this.allTickets = observer
      }
    )
  }

  filterFormValues(){
    alert(JSON.stringify(this.filterForm.value))
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
    // TODO Remove this from here. These values initilaized for EVERY TICKET and makes complicated frontside. Not good 
    let filterTicketTypes = this.filterForm.get(['ticketFilter','ticketType'])?.value
    let filterPriorities = this.filterForm.get(['ticketFilter','priority'])?.value
    let filterCompanies = this.filterForm.get(['ticketFilter','company'])?.value
    let filterPlatforms = this.filterForm.get(['ticketFilter','platform'])?.value
    let filterStatuses = this.filterForm.get(['ticketFilter','status'])?.value
    let startDate = new Date(this.filterForm.get(['timeFilter','startDate']).value).getTime();
    let endDate = new Date(this.filterForm.get(['timeFilter','endDate']).value).getTime();
    
    let ticketIssued = new Date(ticket.issueDate).getTime()
    // console.log(`Start Date: ${startDate}, End Date: ${endDate}, Ticket Date: ${ticketIssued}`)

    if( filterTicketTypes.includes(ticket.ticketType) && filterPriorities.includes(ticket.priority)
     && filterCompanies.includes(ticket.company) && filterPlatforms.includes(ticket.platform)
     && filterStatuses.includes(ticket.status) 
     && ticketIssued >= startDate && ticketIssued <= endDate ) return true;
    
    return false;
    // alert(this.filterForm.value.ticketFilter.ticketType)
    // console.log(this.filterForm.value.ticketFilter.ticketType)
  }


  generateReport(){
    // console.log(this.filterForm.get(['ticketFilter','ticketType'])?.value)
    
    this.filteredTickets = this.allTickets.filter((ticket)=>{
      if(this.matchesFilters(ticket)) return ticket;
      else return null;
    })
    console.log(this.filteredTickets)
    this.generated = true;
  }
  
  tickDetails(ticket:Ticket){
    return JSON.stringify(ticket)
  }

  downloadCSV(){
    let ticketsCSV = [];
    let ticketHeaders = this.ticketService.TICKET_HEADERS;
    ticketsCSV.push(ticketHeaders.join(","));
    this.filteredTickets.forEach((ticket, index)=>{
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
  ngrxGetUser(){
    this.ngrxUserObservable = this.store.select('userReducer');
    this.ngrxUserObservable.subscribe(observer => {
      this.currUser = observer.currUser;
      console.log(this.currUser);
    })
  }


  // debuggers
  showCurrUser(){
    console.log(this.currUser);
    alert(JSON.stringify(this.currUser))
  }
  dates(){
    alert( 'Starts '+this.filterForm.get(['timeFilter','startDate']).value +'; Ends: '+this.filterForm.get(['timeFilter','endDate']).value )
  }

  ngOnInit(): void {
    this.retrieveTickets();
    // this.rxjsGetCurrentUser();
    this.ngrxGetUser()
  }
}

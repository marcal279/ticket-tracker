import { Component, OnInit } from '@angular/core';
// import {MatDialog, MatDialogConfig} from '@angular/material/dialog';

@Component({
  selector: 'app-create-ticket-dialog',
  templateUrl: './create-ticket-dialog.component.html',
  styleUrls: ['./create-ticket-dialog.component.css']
})
export class CreateTicketDialogComponent implements OnInit {

  constructor() { }

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
  ngOnInit(): void {
  }

}

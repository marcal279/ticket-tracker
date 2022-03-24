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
  platformList: String[] = ['LP','LA','SCP','SCA','DCP','DCA','WBS','LAA','DCAA'];
  platformNames: String[] = ['LCO Portal','LCO App', 'Selfcare Portal', 'Selfcare App', 'DP Collection Portal', 'DP Collection App',
    'Website', 'LCO Admin App', 'DP Collection Admin'];

  
  departments: String[] = ['Finance','Ops','Legal','Logistics'];
  ngOnInit(): void {
  }

}

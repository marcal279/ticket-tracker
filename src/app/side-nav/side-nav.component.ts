import { Component, Input, OnInit } from '@angular/core';
import {TooltipPosition} from '@angular/material/tooltip';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  
  @Input() currPage?:string;
  sideNavIconList : string[] = ['severity--v2', 'two-tickets', 'bar-chart'];
  sideNavSectionList: string[] = ['Dashboard', 'Ticket Manager', 'Analytics'];

  pageActive(iconName: string) : Boolean{
    if(this.currPage == this.sideNavSectionList[this.sideNavIconList.indexOf(iconName)]) return true;
    return false;
  }

  toolTipPosition: TooltipPosition = "right";
  
  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, Input, OnInit } from '@angular/core';
import {TooltipPosition} from '@angular/material/tooltip';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  sideNavOpen : boolean = false;

  toggleSideNav(){
    this.sideNavOpen = !this.sideNavOpen;
  }
  
  @Input() currPage?:string;
  sideNavIconList : string[] = ['severity--v2', 'two-tickets', 'bar-chart', 'user'];
  sideNavSectionList: string[] = ['Dashboard', 'Ticket Manager', 'Report Generator', 'My Profile'];

  toolTipPosition: TooltipPosition = "right";
  
  constructor(private router: Router) { }

  givePageName(iconName: string): string{
    return this.sideNavSectionList[this.sideNavIconList.indexOf(iconName)];
  }

  pageActive(iconName: string) : Boolean{
    if(this.currPage == this.sideNavSectionList[this.sideNavIconList.indexOf(iconName)]) return true;
    return false;
  }

  goToPage(icon: string){
    let navigateTo = ''
    switch(icon){
      case 'severity--v2':
        navigateTo = 'dash';
        break;
      case 'two-tickets':
        navigateTo = 'manage';
        break;
      case 'bar-chart':
        navigateTo = 'reports';
        break;
      case 'user':
        navigateTo = 'user';
        break;
      default:
        break;  
    }
    this.router.navigate([navigateTo])
  }

  ngOnInit(): void {
  }
}

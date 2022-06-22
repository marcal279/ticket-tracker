// https://apexcharts.com/docs/angular-charts/
import { Component, ViewChild, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexFill,
  ApexPlotOptions,
  ApexTheme
} from "ng-apexcharts";

import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';

import { TicketDialogComponent } from '../ticket-dialog/ticket-dialog.component';

import { TicketsService } from '../../shared/services/tickets/tickets.service';
import { UserService } from '../../shared/services/users/user.service';
import { UserAuthService } from '../../shared/services/user-auth/user-auth.service';

import { Ticket } from '../../shared/interfaces/ticket';
import { User } from '../../shared/interfaces/user';

//* State Management

//* USED ngrx State Management
import { Store } from '@ngrx/store';
import { UserAction } from '../../shared/ngrx-state/app.actions';
// ! UNUSED: rxjs State Management
import { StateDataService } from '../../shared/services/state-data/state-data.service';
import { Router } from '@angular/router';



export type LineChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  theme: ApexTheme;
};

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  theme: ApexTheme;
  plotOptions: ApexPlotOptions;
};

export type GroupedBarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

export type PolarChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  stroke: ApexStroke;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0px'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})

export class DashboardComponent implements OnInit, OnDestroy {
  
  currPage:string = 'Dashboard';
  allTickets: Ticket[] = []

  nightModeActive: boolean = false;
  currUID !: string;
  currUser !: User; // remove later by using ngrx

  expandedRow: Ticket|null = null;

  isAuthenticated = false;

  @ViewChild("lineChart") lineChart: ChartComponent | undefined;
  public lineChartOptions: Partial<LineChartOptions>;

  @ViewChild("pieChart") pieChart: ChartComponent | undefined;
  public pieChartOptions!: Partial<PieChartOptions>;
  
  @ViewChild("grBarChart") grBarChart: ChartComponent | undefined;
  public grBarChartOptions!: Partial<GroupedBarChartOptions>;

  @ViewChild("polarChart") polarChart: ChartComponent | undefined;
  public polarChartOptions!: Partial<PolarChartOptions>;

  pieChartNoData = {
    // ['New', 'Approved', 'Hold', 'In Progress', 'Dev Complete', 'QA', 'UAT Ready', 'Production Ready', 'Closed', 'Reopened'],
    new: 0,
    approved: 0,
    hold: 0,
    progress: 0,
    dev: 0,
    qa: 0,
    uat: 0,
    production: 0,
    closed: 0,
    reopened: 0
  }
  doubleBarChartNoData = {
    nxt: {
      lcoP: 0, //lco portal
      lcoA: 0, //lco app
      lcoAdmin: 0,
      scP: 0, // selfcare portal
      scA: 0,// selfcare app
      dpP: 0,// dp portal
      dpA: 0,// dp app
      dpAdmin: 0,// dp admin portal
      web: 0,// website
      mso: 0// mso
    },
    imcl: {
      lcoP: 0, //lco portal
      lcoA: 0, //lco app
      lcoAdmin: 0,
      scP: 0, // selfcare portal
      scA: 0,// selfcare app
      dpP: 0,// dp portal
      dpA: 0,// dp app
      dpAdmin: 0,// dp admin portal
      web: 0,// website
      mso: 0// mso
    }
  }

  constructor(
    public dialog: MatDialog, public datepipe: DatePipe, private ticketService: TicketsService,
    private userService: UserService, private authService: UserAuthService,
    private store: Store< {userReducer: {currUser: User}} >,
    private stateData: StateDataService,
    private router: Router
    ){
    // we also use constructor to initialize charts
    this.lineChartOptions = {
      series: [
        {
          name: "Tickets",
          data: [0,0,0,0,0,0,19,1,8,24,2,0],
        }
      ],
      chart: {
        height: 200,
        type: "line",
        zoom: {
          enabled: false
        },
        fontFamily: 'Roboto, sans-serif'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        // curve: "smooth"
      },
      title: {
        text: "Tickets Raised per Month 2021",
        align: "left",
        style: {
          // fontFamily: 'Fredoka, san-serif'
          fontFamily: 'Roboto, san-serif'
        }
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        },
        padding: {
          bottom: 10 
        }
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ]
      },
      // theme: {
      //   // mode: 'light', 
      //   // palette: 'palette10', 
      //   monochrome: {
      //     enabled: true,
      //     // color: '#AA1A86',
      //   },
      // }
      // 0053FF
    };

    this.pieChartOptions = {
      series: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      chart: {
        // type: "donut",
        type: "pie",
        height: 200,
        fontFamily: "Roboto, sans-serif",
        // background: "rgb(236, 239, 241)",
      },
      title:{
        text:"Aggregated Tickets Status",
        align:"left",
        style: {
          fontFamily: 'Roboto, sans-serif'
        }
      },
      plotOptions:{
        pie: {
          customScale: 0.7,
        }
      },
      labels: ['New', 'Approved', 'Hold', 'In Progress', 'Dev Complete', 'QA', 'UAT Ready', 'Production Ready', 'Closed', 'Reopened'],
      dataLabels: {
        style: {
          fontSize: "9px",
          fontWeight: 400,
          colors: ["#fff"]
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ],
      theme: {
        // mode: 'light', 
        // palette: 'palette10', 
        monochrome: {
          enabled: true,
          shadeTo: 'dark',
          color: '#2780ff',
          // shadeTo: 'light',
          // color: '#005edd',
          shadeIntensity: 0.6
        },
      }
    };

    this.grBarChartOptions = {
      series: [
        {
          name: "NXT",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
          color: '#B1006F'
        },
        {
          name: "IMCL",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
          color: '#045add'
        }
      ],
      title: {
        text: "",
        align: "left",
        style: {
          fontFamily: 'Fredoka, san-serif'
        }
      },
      chart: {
        type: "bar",
        width: '88%',
        height: 360,
        fontFamily: 'Roboto, sans-serif'
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: "top"
          }
        }
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: "9px",
          fontWeight: 400,
          colors: ["#fff"]
        }
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["#fff"]
      },
      xaxis: {
        categories: ["LCO Portal","LCO App","LCO Admin","Selfcare Portal", "Selfcare App", "DP Portal", "DP App", "DP Admin Portal", "Website"]
      }
    };
    // NXT labels:["LCO Portal","LCO App","LCO Admin","Selfcare Portal", "Selfcare App", "DP Portal", "DP App", "DP Admin Portal", "Website","MSO"],
    // IMCL labels:["LCO Portal","LCO App","LCO Admin","Selfcare Portal", "Selfcare App","Selfcare Admin Portal","DP Portal", "DP App", "DP Admin Portal", "Website"],  
  }

  checkIsAuthenticated(){
    return this.authService.isAuthenticated
  }

  goToTickManager(){
    this.router.navigate(['/manage']);
  }

  goToDetails(key: string){
    this.router.navigate([`/ticket/${key}`]);
  }

  toggleNightMode(){
    this.nightModeActive = !this.nightModeActive;
  }

  getIndex(fromTicket: Ticket): Number{
    let numPattern = /[0-9]/g;
    return Number(fromTicket.tid.match(numPattern).join(''))
  }

  createTicket(): void{
    if(!this.currUser.empEid){
      alert('Fetching user details, please try again in 5 seconds');
      this.getAuthUser();
      this.ngrxStoreUser();
    }

    else{
      const dialogConfig = new MatDialogConfig();

      dialogConfig.autoFocus = false;  // automatically sets focus to first text box
      dialogConfig.width = '46rem';
      dialogConfig.data = {
        ticketDialogTitle: 'Create',
        currEmail: this.currUser.empEid,
        nextIndex: this.allTickets.slice(-1)[0] ? (+this.getIndex(this.allTickets.slice(-1)[0]) + 1) : 1
      }

      const dialogRef = this.dialog.open(TicketDialogComponent, dialogConfig);
      // dialogRef.afterClosed().subscribe(resultObserver => {
      //   if(resultObserver) this.getStatistics() done in retrieve ticket itself
      // })
    }
  }

  timeOfDay:string='';
  getTimeOfDay():void{
    let currDT = this.datepipe.transform((new Date()), 'h:mm a');
    // alert('currDT = '+currDT);
    if(currDT?.endsWith('PM')){
      if(Number(currDT?.slice(0,1))>=4) this.timeOfDay='Evening';
      else this.timeOfDay='Afternoon';
    }
    else this.timeOfDay = 'Morning';
  }


  displayedColumns: string[] = ['ticketType','tid','title', 'empEid','priority', 'issueDate', 'expectedDate','status'];
  colNames: string[] = ['Type','TID','Title', 'Raised By', 'Priority','Created','Expected','Status'];
  
  
  altDisplayedColumns: string[] = ['ticketType','tid','title', 'empEid','priority', 'issueDate','status'];
  altColNames: string[] = ['Type','TID','Title', 'Raised By', 'Priority','Created','Status'];


  dataSource = new MatTableDataSource<Ticket>();
  @ViewChild(MatSort) sort!: MatSort;

  retrieveTickets(){ // from db
    this.ticketService.readDBTicket().snapshotChanges().pipe(
      map(changes => changes.map( (c: { payload: { key: any; val: () => any; }; })=>
      ({ key: c.payload.key, ...c.payload.val() }) )
      )
    ).subscribe(observer => {
      this.dataSource.data = observer.slice(-3).reverse();  // only last 3 records
      this.dataSource.sort = this.sort;
      this.allTickets = observer;
      
      this.getStatistics();
    });
  }

  statusIsNew(status: string): boolean{
    if(status.endsWith('New')) return true;
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
    if(!this.statusIsClosed(status) && !this.statusIsNew(status)&& !this.statusIsHold(status)) return true;
    return false;
  }

  giveIcon(status: string){
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

  is2049(date: Date): boolean{
    return (new Date(date)).getTime() == (new Date(2049,0,1)).getTime()
  }


  myPending = 0; myProduction = 0; myClosed = 0;
  getMyCounts(){
    // let currEid = (await this.currUser)  // todo try using await and async in dashboard 
    let currEid = this.currUser? this.currUser.empEid : '';
    // alert('currEid = '+currEid)
    if(this.allTickets.length > 0){
      // console.log('entered')
      let pending=0, prod=0, closed=0;
      let myTickets = this.allTickets.filter((value: Ticket)=>{
        if(value.empEid == currEid){
          if(this.statusIsNew(value.status)) pending+=1
          else if(this.statusIsClosed(value.status)) closed+=1
          else prod+=1
          return value;
        }
        else return null;
      });
      this.myPending = pending;
      this.myClosed = closed;
      this.myProduction = prod;
    }
    // else alert('len 0')
    // let total = myTickets.length;
  }

  refreshBoth(){
    this.getAuthUser();
    this.getMyCounts();
  }


  getPieData(){
    let pieDataCopy = {...this.pieChartNoData};
    if(this.allTickets.length > 0){
      this.allTickets.forEach((value: Ticket)=>{
        if(value.status){
          // ['New', 'Approved', 'Hold', 'In Progress', 'Dev Complete', 'QA', 'UAT Ready', 'Production Ready', 'Closed', 'Reopened']
          switch(value.status){
            case 'New': pieDataCopy.new+=1; break;
            case 'Approved': pieDataCopy.approved+=1; break;
            case 'Hold': pieDataCopy.hold+=1; break;
            case 'In Progress': pieDataCopy.progress+=1; break;
            case 'Dev Complete': pieDataCopy.dev+=1; break;
            case 'QA': pieDataCopy.qa+=1; break;
            case 'UAT Ready': pieDataCopy.uat+=1; break;
            case 'Production Ready': pieDataCopy.production+=1; break;
            case 'Closed': pieDataCopy.closed+=1; break;
            case 'Reopened': pieDataCopy.reopened+=1; break;
            default:
              break;
          }
        }
      });
    }
    // else alert('len 0 pieChart')
    this.pieChartOptions.series = Object.values(pieDataCopy)
  }
  getDoubleBarData(){
    let doubleBarDataCopy = {...this.doubleBarChartNoData};
    if(this.allTickets.length > 0){
      this.allTickets.forEach((value: Ticket)=>{
        if(value.platform){
          if(value.company == 'NXTDigital'){
            switch(value.platform){
              case 'LCO Portal': doubleBarDataCopy.nxt.lcoP +=1; break;
              case 'LCO App': doubleBarDataCopy.nxt.lcoA +=1; break 
              case 'LCO Admin Portal': doubleBarDataCopy.nxt.lcoAdmin +=1; break;
              case 'Selfcare Portal': doubleBarDataCopy.nxt.scP +=1; break;
              case 'Selfcare App': doubleBarDataCopy.nxt.scA +=1; break;
              case 'DP Collection Portal': doubleBarDataCopy.nxt.dpP +=1; break;
              case 'DP Collection App': doubleBarDataCopy.nxt.dpA +=1; break;
              case 'DP Collection Admin': doubleBarDataCopy.nxt.dpAdmin +=1; break;
              case 'Website': doubleBarDataCopy.nxt.web +=1; break;
              case 'MSO Portal': doubleBarDataCopy.nxt.mso +=1; break;
              case 'Other': break; // todo add this in graph later if needed 
              default:
                alert('none for '+value.title+' with '+value.platform);
                break;
            }
          }
          else if(value.company == 'INDigital'){
            switch(value.platform){
              case 'LCO Portal': doubleBarDataCopy.imcl.lcoP +=1; break;
              case 'LCO App': doubleBarDataCopy.imcl.lcoA +=1; break;
              case 'LCO Admin Portal': doubleBarDataCopy.imcl.lcoAdmin +=1; break;
              case 'Selfcare Portal': doubleBarDataCopy.imcl.scP +=1; break;
              case 'Selfcare App': doubleBarDataCopy.imcl.scA +=1; break;
              case 'DP Collection Portal': doubleBarDataCopy.imcl.dpP +=1; break;
              case 'DP Collection App': doubleBarDataCopy.imcl.dpA +=1; break;
              case 'DP Collection Admin': doubleBarDataCopy.imcl.dpAdmin +=1; break;
              case 'Website': doubleBarDataCopy.imcl.web +=1; break;
              case 'MSO Portal': doubleBarDataCopy.imcl.mso +=1; break;
              case 'Other': break; // todo add this in graph later if needed 
              default:
                alert('none for '+value.title+' with '+value.platform);
                break;
            }
          }
        }
        else{alert('no platform for '+value.title+' tid: '+value.tid)}
      });
    }
    // else alert('len 0 doubleBarChart')

    if(this.grBarChartOptions.series){
      //* See https://apexcharts.com/docs/angular-charts/#:~:text=Updating%20Angular%20Chart%20Data
      this.grBarChartOptions.series = [
        {data: Object.values(doubleBarDataCopy.nxt)},
        {data: Object.values(doubleBarDataCopy.imcl)}
      ]
    }
  }
  
  getStatistics(){
    this.getMyCounts();
    
    // get Pie Chart
    this.getPieData();
    
    // get Double Bar data
    this.getDoubleBarData();
  }

  

  ngOnInit(): void {
    this.getTimeOfDay();

    this.retrieveTickets(); // also retrieves statistics

    // if renavigate to dash from some other page in our app doesnt need to fetch user every time
    if(sessionStorage.getItem('initialized')!='1'){ // initial startup
      this.getAuthUser();
    }
    else{
      this.ngrxGetUser();
      this.currUser = this.ngrxCurrUser
    }

    // if page is refreshed, but user still authenticated, get user
    if(this.checkIsAuthenticated()) this.getAuthUser();
  }

  getAuthUser(){
    console.log('getting AuthUser at '+(new Date()).toLocaleTimeString())
    this.currUID = this.authService.currentUserUID();
    if(this.currUID){
      // console.log('uid = '+this.currUID)
      this.userService.readDBsingleUser(this.currUID).subscribe((response) => {this.currUser = response as User});
      // console.log('User details from dashboard: ',this.currUser)
      sessionStorage.setItem('initialized', '1');
      // this.isAuthenticated = true;
      // console.log('Authenticated here')
    }
    else setTimeout(()=>{this.getAuthUser()}, 500)
  }


  refreshUser(){
    if(!this.currUID && !this.currUser){
      this.currUID = this.authService.currentUserUID(); // it just works here idk why
      this.userService.readDBsingleUser(this.currUID).subscribe(observer => {this.currUser = observer as User});;
    }

    this.getMyCounts();
  }

  giveCurrentUser(){
    alert(JSON.stringify(this.currUser))
  }
  // rxjsStoreCurrentUser(){
  //   this.stateData.setUser(this.currUser);
  // }
  // rxjsGetCurrentUser(){
  //   this.stateData.currentUser.forEach((user)=> {
  //     //alert('rxjs sends '+JSON.stringify(user))
  //     this.currUser = user;
  //   })  // or use .subscribe()
  // }

  ngrxUserObservable: Observable<{currUser: User}>;
  // ngrxUserObservable: Observable<{currUser: User, nextIndex: Number}>;
  ngrxCurrUser: User;
  ngrxGetUser(){
    this.ngrxUserObservable = this.store.select('userReducer');
    this.ngrxUserObservable.subscribe(observer => {
      this.ngrxCurrUser = observer.currUser;
      console.log(observer);
      // console.log('Next Index: '+ observer.nextIndex);
      // alert(JSON.stringify(observer))
    })
  }
  ngrxStoreUser(){
    this.store.dispatch(new UserAction(this.currUser))
  }


  logout(){
    this.authService.logout();
    sessionStorage.removeItem('initialized')
  }


  ngOnDestroy(){
    console.log('On Destroy');
    this.ngrxStoreUser()
  }
}

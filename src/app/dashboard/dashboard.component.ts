// https://apexcharts.com/docs/angular-charts/
import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
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
import { Ticket } from '../ticket';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { TicketsService } from '../tickets.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TicketDialogComponent } from '../ticket-dialog/ticket-dialog.component';
import { map } from 'rxjs';

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
export class DashboardComponent implements OnInit {
  nightModeActive: boolean = false;
  currPage:string = 'Dashboard';
  sideNavIconList : string[] = ['severity--v2', 'two-tickets', 'bar-chart'];
  sideNavSectionList: string[] = ['Dashboard', 'Ticket Manager', 'Analytics'];

  toggleNightMode(){
    this.nightModeActive = !this.nightModeActive;
  }

  createTicket(): void{
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;  // automatically sets focus to first text box
    dialogConfig.width = '52.5%';
    dialogConfig.data = {
      ticketDialogTitle: 'Create',
    }

    const dialogRef = this.dialog.open(TicketDialogComponent, dialogConfig);
  }

  @ViewChild("lineChart") lineChart: ChartComponent | undefined;
  public lineChartOptions: Partial<LineChartOptions>;

  @ViewChild("pieChart") pieChart: ChartComponent | undefined;
  public pieChartOptions!: Partial<PieChartOptions>;
  
  @ViewChild("grBarChart") grBarChart: ChartComponent | undefined;
  public grBarChartOptions!: Partial<GroupedBarChartOptions>;

  @ViewChild("polarChart") polarChart: ChartComponent | undefined;
  public polarChartOptions!: Partial<PolarChartOptions>;

  timeOfDay:string='';
  getTimeOfDay():void{
    let currDT = this.datepipe.transform((new Date), 'h:mm a');
    // alert('currDT = '+currDT);
    if(currDT?.slice(5)=='PM'){
      if(Number(currDT?.slice(0,1))>=4) this.timeOfDay='Evening';
      else this.timeOfDay='Afternoon';
    }
    else this.timeOfDay = 'Morning';
  }

  iconColour : string = "056ADD";
  pageActive(iconName: string) : Boolean{
    if(this.currPage == this.sideNavSectionList[this.sideNavIconList.indexOf(iconName)]) return true;
    return false;
  }

  allTickets: Ticket[] = []
  getTickets(){
    this.ticketService.getTickets().subscribe(ticketObserver => this.allTickets = ticketObserver)
  }

  // retrievedAll: Boolean = false;
  retrieveTickets(){ // from db
    this.ticketService.readDBTicket().snapshotChanges().pipe(
      map(changes =>changes.map( (c: { payload: { key: any; val: () => any; }; })=>
      ({ key: c.payload.key, ...c.payload.val() }) )
      )
    ).subscribe(observer => {
      this.dataSource.data = observer.slice(-3);
      this.dataSource.sort = this.sort;
      this.allTickets = observer;
    });
  }

  statusIsPending(status: string): boolean{
    if(status.endsWith('Pending')) return true; // handles AAPending and Pending
    return false;
  }
  statusIsClosed(status: string){
    if(status.endsWith('Closed')) return true;
    return false;
  }
  statusIsProcessing(status: string){
    if(!this.statusIsClosed(status) && !this.statusIsPending(status)) return true;
    return false;
  }
  lastIcon: string = 'tick';

  myPending = 0; myProduction = 0; myClosed = 0;
  getMyCounts(){
    if(this.allTickets.length > 0){
      // console.log('entered')
      let myTickets = this.allTickets.filter((value: Ticket)=>{
        if(value.empEid == 'marc.almeida@gmail.com'){
          // console.log('marc.almeida@gmail.com found')
          if(this.statusIsPending(value.status)) this.myPending+=1
          else if(this.statusIsClosed(value.status)) this.myClosed+=1
          else this.myProduction+=1
          return value;
        }
        else return null;
      })
    }
    else alert('len 0')
    // let total = myTickets.length;
  }
  
  displayedColumns: string[] = ['tid','title', 'empEid','priority', 'duration', 'expectedDate','status'];
  colNames: string[] = ['TID', 'Title', 'Raised By', 'Priority', 'Duration','Expected','Status'];

  dataSource = new MatTableDataSource<Ticket>();
  @ViewChild(MatSort) sort!: MatSort;
  // @ViewChild('ticketPaginator') ticketPaginator !: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.data = this.allTickets.slice(0,3); // TODO change this to most recent 3
    this.dataSource.sort = this.sort;
  }

  expandedRow: Ticket|null = null;

  constructor(public dialog: MatDialog, public datepipe: DatePipe, private ticketService: TicketsService){
    // we also use constructor to initialize charts
    this.lineChartOptions = {
      series: [
        {
          name: "Tickets",
          data: [10, 41, 35, 51, 40, 62, 14, 74, 102, 22, 10, 34]
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
      // 0053FF
    };

    this.pieChartOptions = {
      series: [20, 25, 13, 43, 45],
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
      labels: ["Pending", "Production", "Testing", "Approval", "Closed"],
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
          // shadeTo: 'dark',
          // color: '#2780ff',
          shadeTo: 'light',
          // color: '#005ee3',
          color: '#005ee3',
          shadeIntensity: 0.8
        },
      }
    };

    this.grBarChartOptions = {
      series: [
        {
          name: "NXT",
          data: [44, 55, 41, 64, 22, 43, 21, 13, 15],
          color: '#B1006F'
        },
        {
          name: "IMCL",
          data: [53, 32, 33, 52, 13, 44, 32, 20, 10],
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

  ngOnInit(): void {
    this.getTimeOfDay();
    // this.getTickets();
    this.retrieveTickets();
    setTimeout(()=>{this.getMyCounts()}, 7000)
  }

}

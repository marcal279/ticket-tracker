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
import { style } from '@angular/animations';

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

export type DonutChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
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
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currPage:string = 'Dashboard';
  sideNavIconList : string[] = ['severity--v2', 'two-tickets', 'bar-chart'];
  sideNavSectionList: string[] = ['Dashboard', 'Ticket Manager', 'Analytics'];

  @ViewChild("lineChart") lineChart: ChartComponent | undefined;
  public lineChartOptions: Partial<LineChartOptions>;

  @ViewChild("donutChart") donutChart: ChartComponent | undefined;
  public donutChartOptions!: Partial<DonutChartOptions>;
  
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
  // rgb(177,0,111) nxt
  //#2070a3 imcl

  sampleTickets: Ticket[] = [];
  generateSampleTickets(){
    for(let i=1; i<=5;i++){
      let newTicket: Ticket = {
        tid: String(50+i),
        // empid: Math.random()>0.5?'NXT1234':'NXT9876',
        empid: 'NXT1234',
        title: 'Ticket No. '+ String(50+i),
        desc: Math.random()>0.5?'desc':null,
        status: ['Pending','Production','Testing','Approval','Closed'][Math.floor(Math.random()*5)],
        duration: String(Math.ceil(Math.random()*3))+'w',
      }
      this.sampleTickets.push(newTicket);
    }
  }
  displayedColumns: string[] = ['tid','title','duration','status'];
  dataSource = this.sampleTickets;


  constructor(public datepipe: DatePipe){
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
          fontFamily: 'Fredoka, san-serif'
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
      }
    };

    this.donutChartOptions = {
      series: [20, 25, 13, 43, 45],
      chart: {
        type: "donut",
        height: 200,
        fontFamily: "Roboto, sans-serif",
        // background: "rgb(236, 239, 241)",
      },
      title:{
        text:"Aggregated Tickets Status",
        align:"left",
        style: {
          fontFamily: 'Fredoka, san-serif'
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
      // theme: {
      //   mode: 'light', 
      //   palette: 'palette1', 
      //   monochrome: {
      //       enabled: false,
      //       color: '#0027a7',
      //       shadeTo: 'light',
      //       shadeIntensity: 0.6
      //   },
      // }
    };

    this.grBarChartOptions = {
      series: [
        {
          name: "NXT",
          data: [44, 55, 41, 64, 22, 43, 21, 13, 15],
          // color: '#B1006F'
        },
        {
          name: "IMCL",
          data: [53, 32, 33, 52, 13, 44, 32, 20, 10],
          // color: '#2070a3'
        }
      ],
      title: {
        text: "NXT vs IMCL Tickets 2021",
        align: "left",
        style: {
          fontFamily: 'Fredoka, san-serif'
        }
      },
      chart: {
        type: "bar",
        height: 400,
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
    this.generateSampleTickets();
  }

}

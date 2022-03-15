// https://apexcharts.com/docs/angular-charts/
import { Component, ViewChild, OnInit } from '@angular/core';
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
  ApexPlotOptions
} from "ng-apexcharts";

export type LineChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
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
  title: ApexTitleSubtitle; // lets see if this works
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild("lineChart") lineChart: ChartComponent | undefined;
  public lineChartOptions: Partial<LineChartOptions>;

  @ViewChild("donutChart") donutChart: ChartComponent | undefined;
  public donutChartOptions!: Partial<DonutChartOptions>;
  
  @ViewChild("grBarChart") grBarChart: ChartComponent | undefined;
  public grBarChartOptions!: Partial<GroupedBarChartOptions>;


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

  constructor(public datepipe: DatePipe){
    this.lineChartOptions = {
      series: [
        {
          name: "Tickets",
          data: [10, 41, 35, 51, 40, 62, 14, 74, 102]
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        },
        fontFamily: 'Merriweather Sans, sans-serif'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      title: {
        text: "Avg. Total Tickets per Month",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
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
          "Sep"
        ]
      }
    };

    this.donutChartOptions = {
      series: [20, 25, 13, 43, 45],
      chart: {
        type: "donut",
        fontFamily: "Merriweather Sans, sans-serif"
      },
      title:{
        text:"Tickets Status",
        align:"left"
      },
      labels: ["Pending", "Production", "Testing", "Approval", "Closed"],
      dataLabels: {
        style: {
          fontSize: "12px",
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
      ]
    };

    this.grBarChartOptions = {
      series: [
        {
          name: "NXT",
          data: [44, 55, 41, 64, 22, 43, 21, 13, 15]
        },
        {
          name: "IMCL",
          data: [53, 32, 33, 52, 13, 44, 32, 20, 10]
        }
      ],
      title: {
        text: "NXT vs IMCL Tickets",
        align: "left"
      },
      chart: {
        type: "bar",
        height: 430,
        fontFamily: 'Merriweather Sans, sans-serif'
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
          fontSize: "10px",
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
  }

}

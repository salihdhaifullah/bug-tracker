import { TicketsService } from 'src/services/api.service';
import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from "chart.js";
import { Static } from 'src/Static';
import * as moment from 'moment';

interface TicketData {
  createdAt: Date
  isCompleted: boolean
}

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html'
})

export class LineChartComponent implements OnInit {
tickets: TicketData[] = [];
ChartLabels: string[] = [];
ChartData: number[] = [];
lineChartData: any;
lineChartOptions: any;
lineChartLegend: any;
isLoading: boolean = true;
_moment = moment;
  constructor(private ticketsService: TicketsService) { }

  ngOnInit(): void {
    let biggestMonthIndex = 0;
    let smallestMonthIndex = 0;
    this.ticketsService.GetLineChartData().subscribe(data => {
      this.tickets = data;
      this.isLoading = true;
    }, err => {}, () => {

      for (let ticket of this.tickets) {
        const month = this._moment(ticket.createdAt).format('MMMM')
        if (month === Static.Months[biggestMonthIndex] || month === Static.Months[smallestMonthIndex]) { }
        else if (Static.Months.indexOf(month) > biggestMonthIndex) {
          biggestMonthIndex = Static.Months.indexOf(month)
        }
        else if (Static.Months.indexOf(month) > smallestMonthIndex) {
          smallestMonthIndex = Static.Months.indexOf(month)
        }
      }

      this.ChartLabels = Static.Months.slice(smallestMonthIndex, ++biggestMonthIndex);
      console.log(this.ChartLabels);
      for (let ChartMonth of this.ChartLabels) {
        const data = this.tickets.filter(item => item.isCompleted === true)
        this.ChartData.push(data.filter(item => this._moment(item.createdAt).format('MMMM') === ChartMonth).length)
      }

      this.lineChartData = {
        labels: this.ChartLabels,
        datasets: [
          {
            data: this.ChartData,
            label: 'Tickets Done',
            fill: true,
            tension: 0.5,
            borderColor: 'black',
            backgroundColor: 'rgba(59,128,246,0.5)'
          }
        ]
      };
    
      this.lineChartOptions = { responsive: true };
      this.lineChartLegend = true;

      this.isLoading = false;
    })
  }



}

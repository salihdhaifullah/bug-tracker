import { Static } from './../../../Static';
import { Component, OnInit } from '@angular/core';
import { TicketsService } from 'src/services/api.service';
import * as moment from 'moment';


interface TicketData {
  createdAt: Date
  completedAt: Date
  priority: string
}

interface IChartData {
  data: number[]
  label: string
}


@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html'
})

export class BarChartComponent implements OnInit {
  _moment = moment;
  ChartLabels: string[] = []
  ChartData: IChartData[] = []
  tickets: TicketData[] = [];
  isLoading: boolean = true;


  constructor(private ticketsService: TicketsService) {}

  ngOnInit(): void {
    let biggestMonthIndex = 0;
    let smallestMonthIndex = 0;
    this.ticketsService.GetBarChartData().subscribe(data => {
      this.tickets = data;
      this.isLoading = true;
    }, err => { }, () => {
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


      const data1 = {
        data: this.FilleterData(Static.Priorates.Low),
        label: Static.Priorates.Low
      }
      const data2 = {
        data: this.FilleterData(Static.Priorates.Medium),
        label: Static.Priorates.Medium
      }
      const data3 = {
        data: this.FilleterData(Static.Priorates.High),
        label: Static.Priorates.High
      }
      this.ChartData = [data1, data2, data3];

      this.isLoading = false;
    })
  }

  FilleterData(label: string): number[] {
    const data = this.tickets.filter(ticket => ticket.priority === label)
    if (!data.length) return [0]
    else {
      let endData: number[] = []

      for (let ChartMonth of this.ChartLabels) {
        endData.push(data.filter(item => this._moment(item.createdAt).format('MMMM') === ChartMonth).length)
      }
      return endData;
    }
  }
}

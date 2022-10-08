import { Static } from 'src/Static';
import { TicketsService } from 'src/services/api.service';
import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';

interface ticketState {
  status: string
}

@Component({
  selector: 'app-charts-pie',
  templateUrl: './charts-pie.component.html'
})
export class ChartsPieComponent implements OnInit {
  tickets: ticketState[] = []
  ClosedCount: number = 0;
  InProgressCount: number = 0;
  NewCount: number = 0;
  pieChartDatasets: any[] = []
  isLoading = true;
  constructor(private ticketsService: TicketsService) { }

  pieChartOptions: ChartOptions<'pie'> = { responsive: true };
  pieChartLabels = [Static.Statuses.Closed + " Tickets", Static.Statuses.InProgress + " Tickets", Static.Statuses.New + " Tickets"];

  pieChartLegend = true;
  pieChartPlugins = [];



  ngOnInit(): void {
    this.ticketsService.GetPieChartData().subscribe(data => {
      this.tickets = data
      this.isLoading = true;
    }, err => { }, () => {
      for (let ticket of this.tickets) {
        if (ticket.status === Static.Statuses.Closed) {
          this.ClosedCount += 1;
        } else if (ticket.status === Static.Statuses.InProgress) {
          this.InProgressCount += 1;
        } else if (ticket.status === Static.Statuses.New) {
          this.NewCount += 1;
        } else {}
      }

      this.pieChartDatasets = [{ data: [this.ClosedCount, this.InProgressCount, this.NewCount] }];
      this.isLoading = false;
    })
  }

}

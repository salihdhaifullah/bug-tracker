import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-charts-pie',
  templateUrl: './charts-pie.component.html'
})
export class ChartsPieComponent implements OnInit {

    // Pie
    public pieChartOptions: ChartOptions<'pie'> = {
      responsive: false,
    };
    public pieChartLabels = [ 'Download Sales' , 'In Store Sales', 'Mail Sales' ];
    public pieChartDatasets = [ {
      data: [ 500, 400, 100 ]
    } ];
    public pieChartLegend = true;
    public pieChartPlugins = [];

  constructor() { }

  ngOnInit(): void {
  }

}

import { AuthService } from 'src/services/api.service';
import { Component, OnInit } from '@angular/core';
import { Static } from 'src/Static';
import { ChartOptions } from 'chart.js';

interface UserRoles {
  role: string
}
@Component({
  selector: 'app-user-rols-charts-pie',
  templateUrl: './user-rols-charts-pie.component.html'
})
export class UserRolsChartsPieComponent implements OnInit {

    users: UserRoles[] = []
    DeveloperCount: number = 0;
    SubmitterCount: number = 0;
    ProjectMangerCount: number = 0;
    pieChartDatasets: any[] = []
    isLoading = true;
    constructor(private AuthService: AuthService) { }
  
    pieChartOptions: ChartOptions<'pie'> = { responsive: false };
    pieChartLabels = [Static.Roles.Developer, Static.Roles.Submitter, Static.Roles.ProjectManger];
  
    pieChartLegend = true;
    pieChartPlugins = [];
  
  
  
    ngOnInit(): void {
      this.AuthService.GetPieChartData().subscribe(data => {
        this.users = data
        this.isLoading = true;
      }, err => { }, () => {
        for (let user of this.users) {
          if (user.role === Static.Roles.Developer) {
            this.DeveloperCount += 1;
          } else if (user.role === Static.Roles.Submitter) {
            this.SubmitterCount += 1;
          } else if (user.role ===  Static.Roles.ProjectManger) {
            this.ProjectMangerCount += 1;
          } else {}
        }
  
        this.pieChartDatasets = [{ data: [this.DeveloperCount, this.SubmitterCount, this.ProjectMangerCount] }];
        this.isLoading = false;
      })
    }

}

import { Component, OnInit } from '@angular/core';
import { HttpClientService } from './http.service';
import { environment } from './../environments/environment';
import { Case } from './classes/Case';
import { Status } from './classes/Status';
import { BarChartFormat, AreaChartFormat } from './classes/Chart';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  statuses: Array<Status> = [];
  cases: Array<Case> = [];
  statusesChartData: Array<AreaChartFormat>;
  casesChartData: Array<BarChartFormat> = [];

  getStatuses(): void {
    this.httpService.get(`${environment.API_URL}/clientdata/getAllStatuses`).subscribe(
      (res: any) => {
        res.statuses.forEach(status => {
          const newStatus: Status = {
            date: new Date(status.date),
            cases: status.cases,
            deaths: status.deaths,
            recovered: status.recovered
          };
          this.statuses.push(newStatus);
        });
        // convert fetched data to ngx-chart format
        this.statusesChartData = this.statusesToChartFormat(this.statuses);
      }
    );
  }

  getDailyCases(): void {
    this.httpService.get(`${environment.API_URL}/clientdata/getdailycases`).subscribe(
      (res: any) => {
        res.dailyCases.forEach((dailyCase: Case) => {
          const newCase: Case = {
            date: new Date(dailyCase.date),
            newCases: dailyCase.newCases
          };
          this.cases.push(newCase);
        });
        // convert fetched data to ngx-chart format
        this.casesChartData = this.casesToChartFormat(this.cases);
      }
    );
  }

  statusesToChartFormat(statuses: Array<Status>): Array<AreaChartFormat> {
    const caseStatuses: Array<AreaChartFormat> = [];
    const newCaseStatus: AreaChartFormat = {
      name: 'Number of Cases',
      series: []
    };
    statuses.forEach((status: Status) => {
      const date = `${status.date.getFullYear()}-${status.date.getMonth() + 1}-${status.date.getDate()}`;
      newCaseStatus.series.push({name: date, value: status.cases});
    });
    caseStatuses.push(newCaseStatus);
    return caseStatuses;
  }

  casesToChartFormat(cases: Array<Case>): Array<BarChartFormat> {
    const chartCases: Array<BarChartFormat> = [];
    cases.forEach((dailyCase: Case) => {
      const date = `${dailyCase.date.getFullYear()}-${dailyCase.date.getMonth() + 1}-${dailyCase.date.getDate()}`;
      const newCase: BarChartFormat = {
        name: date,
        value: dailyCase.newCases
      };
      chartCases.push(newCase);
    });
    return chartCases;
  }

  constructor(private httpService: HttpClientService) {
    // run fetch methods
    this.getStatuses();
    this.getDailyCases();
  }

  ngOnInit(): void {}

}

import { Component, OnInit } from '@angular/core';
import { HttpClientService } from './http.service';
import { environment } from './../environments/environment';
import { CaseModel } from './classes/Case';
import { StatusModel } from './classes/Status';
import { BarChartFormat, AreaChartFormat } from './classes/Chart';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  statuses: Array<StatusModel> = [];
  cases: Array<CaseModel> = [];
  totalCases: number;
  statusesChartData: Array<AreaChartFormat> = [];
  casesChartData: Array<BarChartFormat> = [];

  getStatuses(): void {
    this.httpService.get(`${environment.API_URL}/clientdata/getAllStatuses`).subscribe(
      (res: any) => {
        const statuses: Array<StatusModel> = res.statuses;
        statuses.forEach(status => {
          const newStatus: StatusModel = {
            date: new Date(status.date),
            cases: status.cases,
            deaths: status.deaths,
            recovered: status.recovered
          };
          this.statuses.push(newStatus);
        });
        // push() is not recognized by change detection
        this.statuses = [...this.statuses];

        // WORK WITH FETCHED DATA BELOW:
        // convert fetched data to ngx-chart format
        this.statusesChartData = this.statusesToChartFormat(this.statuses);
        // set 'totalCases' to the latest status cases value
        this.totalCases = this.statuses[this.statuses.length - 1].cases;
      }
    );
  }

  getDailyCases(): void {
    this.httpService.get(`${environment.API_URL}/clientdata/getdailycases`).subscribe(
      (res: any) => {
        const dailyCases: Array<CaseModel> = res.dailyCases;
        dailyCases.forEach((dailyCase) => {
          const newCase: CaseModel = {
            date: new Date(dailyCase.date),
            newCases: dailyCase.newCases
          };
          this.cases.push(newCase);
        });
        // push() is not recognized by change detection
        this.cases = [...this.cases];

        // WORK WITH FETCHED DATA BELOW:
        // convert fetched data to ngx-chart format
        this.casesChartData = this.casesToChartFormat(this.cases);
      }
    );
  }

  statusesToChartFormat(statuses: Array<StatusModel>): Array<AreaChartFormat> {
    const caseStatuses: Array<AreaChartFormat> = [];
    const newCaseStatus: AreaChartFormat = {
      name: 'Number of Cases',
      series: []
    };
    statuses.forEach((status: StatusModel) => {
      const date = `${status.date.getFullYear()}-${status.date.getMonth() + 1}-${status.date.getDate()}`;
      newCaseStatus.series.push({name: date, value: status.cases});
    });
    caseStatuses.push(newCaseStatus);
    return caseStatuses;
  }

  casesToChartFormat(cases: Array<CaseModel>): Array<BarChartFormat> {
    const chartCases: Array<BarChartFormat> = [];
    cases.forEach((dailyCase: CaseModel) => {
      const date = `${dailyCase.date.getFullYear()}-${dailyCase.date.getMonth() + 1}-${dailyCase.date.getDate()}`;
      const newCase: BarChartFormat = {
        name: date,
        value: dailyCase.newCases
      };
      chartCases.push(newCase);
    });
    return chartCases;
  }

  refreshData(): void {
    // reset data values
    this.statuses = [];
    this.cases = [];
    this.totalCases = null;
    this.statusesChartData = [];
    this.casesChartData = [];

    // re-fetch datas from API
    this.getStatuses();
    this.getDailyCases();
  }

  constructor(private httpService: HttpClientService) {
    // run fetch methods
    this.getStatuses();
    this.getDailyCases();
  }

  ngOnInit(): void {}
}

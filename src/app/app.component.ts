import { Component, HostListener } from '@angular/core';
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
export class AppComponent {
  statuses: Array<StatusModel> = [];
  cases: Array<CaseModel> = [];
  totalCases: number;
  totalCasesSinceSchool: number;
  newCases: number;
  statusesChartData: Array<AreaChartFormat> = [];
  casesChartData: Array<BarChartFormat> = [];
  lastUpdate: string;
  // window sizes
  areaChartWidth: number;
  areaChartHeight: number;
  barChartWidth: number;
  barChartHeight: number;
  // error handling
  resStatusSuccess: boolean;
  resCaseSuccess: boolean;
  statusErrMessage: string;
  caseErrMessage: string;

  // window resize event listener
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.setChartSizes();
    // reset viewport
    const viewportmeta = document.querySelector('meta[name="viewport"]');
    viewportmeta.setAttribute('content', 'initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0');
  }

  // dynamically sets the chart width and height
  private setChartSizes(): void {
    if (window.screen.orientation.type === 'landscape-primary') {
      this.areaChartWidth = (window.innerWidth / 100) * 90;
      this.areaChartHeight = (window.innerHeight / 100) * 98;
    }
    else {
      this.areaChartWidth = (window.innerWidth / 100) * 98;
      this.areaChartHeight = (window.innerHeight / 100) * 65;
    }
    this.barChartWidth = (window.innerWidth / 100) * 98;
    this.barChartHeight = (window.innerHeight / 100) * 65;
  }

  // data related methods:

  private getStatuses(): void {
    this.httpService.get(`${environment.API_URL}/clientdata/getAllStatuses`).subscribe(
      (res: any) => {
        if (res.success === false) {
          // skip rest of the method if server fails
          this.resStatusSuccess = res.success;
          this.statusErrMessage = res.message;
        }
        else {
          this.resStatusSuccess = res.success;
          // set statuses arr
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
          // set 'totalCasesSinceSchool' to the latest status cases value
          this.totalCasesSinceSchool = this.statuses[this.statuses.length - 1].cases - this.statuses[0].cases;
          // set 'totalCases'
          this.totalCases = this.statuses[this.statuses.length - 1].cases;
          // set 'lastUpdate'
          const rawLastUpdateDate = this.statuses[this.statuses.length - 1].date;
          this.lastUpdate = `${rawLastUpdateDate.toLocaleDateString()} ${rawLastUpdateDate.toLocaleTimeString()}`;
        }
      }
    );
  }

  private getDailyCases(): void {
    this.httpService.get(`${environment.API_URL}/clientdata/getdailycases`).subscribe(
      (res: any) => {
        if (res.success === false) {
          // skip rest of the method if server fails
          this.resCaseSuccess = res.success;
          this.caseErrMessage = res.message;
        }
        else {
          this.resCaseSuccess = res.success;
          // set cases arr
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
          // set 'newCases' to the latest new cases value
          this.newCases = this.cases[this.cases.length - 1].newCases;
        }
      }
    );
  }

  private updateLatestStatus(): void {
    this.httpService.put(`${environment.API_URL}/datamutate/updateLatestStatus`).subscribe(
      () => {
        // re-fetch datas from API
        this.getStatuses();
        this.getDailyCases();
      }
    );
  }

  private statusesToChartFormat(statuses: Array<StatusModel>): Array<AreaChartFormat> {
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

  private casesToChartFormat(cases: Array<CaseModel>): Array<BarChartFormat> {
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
    this.newCases = null;
    this.totalCasesSinceSchool = null;
    this.statusesChartData = [];
    this.casesChartData = [];

    // update status in Database with the latest data from COVID API
    // then fetch the updated data
    this.updateLatestStatus();
  }

  constructor(private httpService: HttpClientService) {
    // set window size props
    this.setChartSizes();
    // run fetch methods
    this.getStatuses();
    this.getDailyCases();
  }
}

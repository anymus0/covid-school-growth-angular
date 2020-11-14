import { Component, OnInit } from '@angular/core';
import { HttpClientService } from './http.service';
import { environment } from './../environments/environment';
import { Case } from './classes/Case';
import { Status } from './classes/Status';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  statuses: Array<Status> = [];
  cases: Array<Case> = [];

  getStatuses(): void {
    this.httpService.get(`${environment.API_URL}/clientdata/getAllStatuses`).subscribe(
      (res: any) => {
        this.statuses = res.statuses;
      }
    );
  }

  getDailyCases(): void {
    this.httpService.get(`${environment.API_URL}/clientdata/getdailycases`).subscribe(
      (res: any) => {
        this.cases = res.dailyCases;
      }
    );
  }

  constructor(private httpService: HttpClientService) {
    // run fetch methods
    this.getStatuses();
    this.getDailyCases();
  }

  ngOnInit(): void {

  }
}

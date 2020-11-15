import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-summary-values',
  templateUrl: './summary-values.component.html',
  styleUrls: ['./summary-values.component.scss']
})
export class SummaryValuesComponent implements OnInit {
  @Input() totalCases: number;
  @Input() newCasesToday: number;

  constructor() { }

  ngOnInit(): void {
  }

}

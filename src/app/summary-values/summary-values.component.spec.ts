import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryValuesComponent } from './summary-values.component';

describe('SummaryValuesComponent', () => {
  let component: SummaryValuesComponent;
  let fixture: ComponentFixture<SummaryValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryValuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportEMailScheduleComponent } from './report-email-schedule.component';

describe('ReportEMailScheduleComponent', () => {
  let component: ReportEMailScheduleComponent;
  let fixture: ComponentFixture<ReportEMailScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportEMailScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportEMailScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

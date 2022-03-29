import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendReportMailComponent } from './send-report-mail.component';

describe('SendReportMailComponent', () => {
  let component: SendReportMailComponent;
  let fixture: ComponentFixture<SendReportMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendReportMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendReportMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

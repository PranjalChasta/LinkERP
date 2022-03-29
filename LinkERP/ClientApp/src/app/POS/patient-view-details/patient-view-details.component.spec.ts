import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientViewDetailsComponent } from './patient-view-details.component';

describe('PatientViewDetailsComponent', () => {
  let component: PatientViewDetailsComponent;
  let fixture: ComponentFixture<PatientViewDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientViewDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientViewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

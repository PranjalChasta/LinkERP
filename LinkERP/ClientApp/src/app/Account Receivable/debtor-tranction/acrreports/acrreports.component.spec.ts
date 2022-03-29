import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ACRReportsComponent } from './acrreports.component';

describe('ACRReportsComponent', () => {
  let component: ACRReportsComponent;
  let fixture: ComponentFixture<ACRReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ACRReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ACRReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

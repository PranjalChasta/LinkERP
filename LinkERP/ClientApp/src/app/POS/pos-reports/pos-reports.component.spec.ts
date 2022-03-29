import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosReportsComponent } from './pos-reports.component';

describe('PosReportsComponent', () => {
  let component: PosReportsComponent;
  let fixture: ComponentFixture<PosReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

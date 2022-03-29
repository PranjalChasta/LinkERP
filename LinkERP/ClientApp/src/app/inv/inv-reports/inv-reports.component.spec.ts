import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvReportsComponent } from './inv-reports.component';

describe('InvReportsComponent', () => {
  let component: InvReportsComponent;
  let fixture: ComponentFixture<InvReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

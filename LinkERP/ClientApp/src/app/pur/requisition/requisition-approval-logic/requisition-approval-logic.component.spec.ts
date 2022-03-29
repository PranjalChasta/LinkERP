import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitionApprovalLogicComponent } from './requisition-approval-logic.component';

describe('RequisitionApprovalLogicComponent', () => {
  let component: RequisitionApprovalLogicComponent;
  let fixture: ComponentFixture<RequisitionApprovalLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequisitionApprovalLogicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionApprovalLogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

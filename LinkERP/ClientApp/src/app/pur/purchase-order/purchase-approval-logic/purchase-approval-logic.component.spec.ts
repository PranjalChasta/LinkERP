import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseApprovalLogicComponent } from './purchase-approval-logic.component';

describe('PurchaseApprovalLogicComponent', () => {
  let component: PurchaseApprovalLogicComponent;
  let fixture: ComponentFixture<PurchaseApprovalLogicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseApprovalLogicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseApprovalLogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandedCostPurchaseOrderComponent } from './landed-cost-purchase-order.component';

describe('LandedCostPurchaseOrderComponent', () => {
  let component: LandedCostPurchaseOrderComponent;
  let fixture: ComponentFixture<LandedCostPurchaseOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandedCostPurchaseOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandedCostPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

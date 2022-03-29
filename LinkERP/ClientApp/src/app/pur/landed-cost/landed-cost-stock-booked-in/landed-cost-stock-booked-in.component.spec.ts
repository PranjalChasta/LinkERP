import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandedCostStockBookedInComponent } from './landed-cost-stock-booked-in.component';

describe('LandedCostStockBookedInComponent', () => {
  let component: LandedCostStockBookedInComponent;
  let fixture: ComponentFixture<LandedCostStockBookedInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandedCostStockBookedInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandedCostStockBookedInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

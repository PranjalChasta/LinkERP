import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandedCostShipmentLinesComponent } from './landed-cost-shipment-lines.component';

describe('LandedCostShipmentLinesComponent', () => {
  let component: LandedCostShipmentLinesComponent;
  let fixture: ComponentFixture<LandedCostShipmentLinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandedCostShipmentLinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandedCostShipmentLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

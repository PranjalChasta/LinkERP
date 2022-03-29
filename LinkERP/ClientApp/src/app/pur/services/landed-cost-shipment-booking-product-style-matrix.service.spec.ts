import { TestBed } from '@angular/core/testing';

import { LandedCostShipmentBookingProductStyleMatrixService } from './landed-cost-shipment-booking-product-style-matrix.service';

describe('LandedCostShipmentBookingProductStyleMatrixService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LandedCostShipmentBookingProductStyleMatrixService = TestBed.get(LandedCostShipmentBookingProductStyleMatrixService);
    expect(service).toBeTruthy();
  });
});

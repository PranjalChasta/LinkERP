import { TestBed } from '@angular/core/testing';

import { LandedCostShipmentLinesService } from './landed-cost-shipment-lines.service';

describe('LandedCostShipmentLinesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LandedCostShipmentLinesService = TestBed.get(LandedCostShipmentLinesService);
    expect(service).toBeTruthy();
  });
});

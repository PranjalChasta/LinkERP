import { TestBed } from '@angular/core/testing';

import { LandedCostService } from './landed-cost.service';

describe('LandedCostService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LandedCostService = TestBed.get(LandedCostService);
    expect(service).toBeTruthy();
  });
});

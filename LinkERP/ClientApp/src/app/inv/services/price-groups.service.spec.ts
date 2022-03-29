import { TestBed } from '@angular/core/testing';

import { PriceGroupsService } from './price-groups.service';

describe('PriceGroupsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PriceGroupsService = TestBed.get(PriceGroupsService);
    expect(service).toBeTruthy();
  });
});

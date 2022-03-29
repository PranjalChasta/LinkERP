import { TestBed } from '@angular/core/testing';

import { InventoryDetailService } from './inventory-detail.service';

describe('InventoryDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InventoryDetailService = TestBed.get(InventoryDetailService);
    expect(service).toBeTruthy();
  });
});

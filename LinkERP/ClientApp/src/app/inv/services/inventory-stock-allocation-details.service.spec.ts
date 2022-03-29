import { TestBed } from '@angular/core/testing';

import { InventoryStockAllocationDetailsService } from './inventory-stock-allocation-details.service';

describe('InventoryStockAllocationDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InventoryStockAllocationDetailsService = TestBed.get(InventoryStockAllocationDetailsService);
    expect(service).toBeTruthy();
  });
});

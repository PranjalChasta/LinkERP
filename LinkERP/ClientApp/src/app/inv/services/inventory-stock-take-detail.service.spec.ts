import { TestBed } from '@angular/core/testing';

import { InventoryStockTakeDetailService } from './inventory-stock-take-detail.service';

describe('InventoryStockTakeDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InventoryStockTakeDetailService = TestBed.get(InventoryStockTakeDetailService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { InventoryStockTakeService } from './inventory-stock-take.service';

describe('InventoryStockTakeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InventoryStockTakeService = TestBed.get(InventoryStockTakeService);
    expect(service).toBeTruthy();
  });
});

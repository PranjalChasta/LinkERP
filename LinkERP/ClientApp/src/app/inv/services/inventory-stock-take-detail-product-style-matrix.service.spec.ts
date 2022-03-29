import { TestBed } from '@angular/core/testing';

import { InventoryStockTakeDetailProductStyleMatrixService } from './inventory-stock-take-detail-product-style-matrix.service';

describe('InventoryStockTakeDetailProductStyleMatrixService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InventoryStockTakeDetailProductStyleMatrixService = TestBed.get(InventoryStockTakeDetailProductStyleMatrixService);
    expect(service).toBeTruthy();
  });
});

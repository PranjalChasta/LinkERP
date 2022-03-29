import { TestBed } from '@angular/core/testing';

import { InventoryProductPriceService } from './inventory-product-price.service';

describe('InventoryProductPriceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InventoryProductPriceService = TestBed.get(InventoryProductPriceService);
    expect(service).toBeTruthy();
  });
});

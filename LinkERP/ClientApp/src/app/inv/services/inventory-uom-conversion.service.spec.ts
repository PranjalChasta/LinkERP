import { TestBed } from '@angular/core/testing';

import { InventoryUOMConversionService } from './inventory-uom-conversion.service';

describe('InventoryUOMConversionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InventoryUOMConversionService = TestBed.get(InventoryUOMConversionService);
    expect(service).toBeTruthy();
  });
});

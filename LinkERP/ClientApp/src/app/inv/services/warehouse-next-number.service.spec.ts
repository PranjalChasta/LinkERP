import { TestBed } from '@angular/core/testing';

import { WarehouseNextNumberService } from './warehouse-next-number.service';

describe('WarehouseNextNumberService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WarehouseNextNumberService = TestBed.get(WarehouseNextNumberService);
    expect(service).toBeTruthy();
  });
});

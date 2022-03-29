import { TestBed } from '@angular/core/testing';

import { ProductStyleMatrixDetailService } from './product-style-matrix-detail.service';

describe('ProductStyleMatrixDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductStyleMatrixDetailService = TestBed.get(ProductStyleMatrixDetailService);
    expect(service).toBeTruthy();
  });
});

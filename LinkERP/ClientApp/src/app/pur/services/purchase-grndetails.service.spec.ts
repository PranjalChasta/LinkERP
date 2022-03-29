import { TestBed } from '@angular/core/testing';

import { PurchaseGRNDetailsService } from './purchase-grndetails.service';

describe('PurchaseGRNDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PurchaseGRNDetailsService = TestBed.get(PurchaseGRNDetailsService);
    expect(service).toBeTruthy();
  });
});

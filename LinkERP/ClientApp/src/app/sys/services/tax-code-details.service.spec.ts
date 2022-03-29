import { TestBed } from '@angular/core/testing';

import { TaxCodeDetailsService } from './tax-code-details.service';

describe('TaxCodeDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaxCodeDetailsService = TestBed.get(TaxCodeDetailsService);
    expect(service).toBeTruthy();
  });
});

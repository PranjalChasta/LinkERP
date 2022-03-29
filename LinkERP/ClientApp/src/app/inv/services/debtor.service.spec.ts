import { TestBed } from '@angular/core/testing';

import { DebtorService } from './debtor.service';

describe('DebtorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DebtorService = TestBed.get(DebtorService);
    expect(service).toBeTruthy();
  });
});

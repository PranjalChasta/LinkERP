import { TestBed } from '@angular/core/testing';

import { InternalTransfersService } from './internal-transfers.service';

describe('InternalTransfersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InternalTransfersService = TestBed.get(InternalTransfersService);
    expect(service).toBeTruthy();
  });
});

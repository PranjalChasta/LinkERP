import { TestBed } from '@angular/core/testing';

import { RequisitionDetailsService } from './requisition-details.service';

describe('RequisitionDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RequisitionDetailsService = TestBed.get(RequisitionDetailsService);
    expect(service).toBeTruthy();
  });
});

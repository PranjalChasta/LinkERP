import { TestBed } from '@angular/core/testing';

import { PurchaseApprovalLogicService } from './purchase-approval-logic.service';

describe('PurchaseApprovalLogicService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PurchaseApprovalLogicService = TestBed.get(PurchaseApprovalLogicService);
    expect(service).toBeTruthy();
  });
});

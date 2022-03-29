import { TestBed } from '@angular/core/testing';

import { RequisitionApprovalLogicService } from './requisition-approval-logic.service';

describe('RequisitionApprovalLogicService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RequisitionApprovalLogicService = TestBed.get(RequisitionApprovalLogicService);
    expect(service).toBeTruthy();
  });
});

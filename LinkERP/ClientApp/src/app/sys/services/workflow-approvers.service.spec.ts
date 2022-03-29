import { TestBed } from '@angular/core/testing';

import { WorkflowApproversService } from './workflow-approvers.service';

describe('WorkflowApproversService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkflowApproversService = TestBed.get(WorkflowApproversService);
    expect(service).toBeTruthy();
  });
});

import { TestBed, inject } from '@angular/core/testing';

import { RoleModuleAccessService } from './role-module-access.service';

describe('RoleModuleAccessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoleModuleAccessService]
    });
  });

  it('should be created', inject([RoleModuleAccessService], (service: RoleModuleAccessService) => {
    expect(service).toBeTruthy();
  }));
});

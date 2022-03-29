import { TestBed } from '@angular/core/testing';

import { ARServicesService } from './arservices.service';

describe('ARServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ARServicesService = TestBed.get(ARServicesService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { MakeModelService } from './make-model.service';

describe('MakeModelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MakeModelService = TestBed.get(MakeModelService);
    expect(service).toBeTruthy();
  });
});

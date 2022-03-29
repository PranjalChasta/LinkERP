import { TestBed } from '@angular/core/testing';

import { RequisitionQuotationAnalysisService } from './requisition-quotation-analysis.service';

describe('RequisitionQuotationAnalysisService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RequisitionQuotationAnalysisService = TestBed.get(RequisitionQuotationAnalysisService);
    expect(service).toBeTruthy();
  });
});

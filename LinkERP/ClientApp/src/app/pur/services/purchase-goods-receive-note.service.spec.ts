import { TestBed } from '@angular/core/testing';

import { PurchaseGoodsReceiveNoteService } from './purchase-goods-receive-note.service';

describe('PurchaseGoodsReceiveNoteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PurchaseGoodsReceiveNoteService = TestBed.get(PurchaseGoodsReceiveNoteService);
    expect(service).toBeTruthy();
  });
});

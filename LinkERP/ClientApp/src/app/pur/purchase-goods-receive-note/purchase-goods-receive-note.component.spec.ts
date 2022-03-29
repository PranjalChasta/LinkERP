import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseGoodsReceiveNoteComponent } from './purchase-goods-receive-note.component';

describe('PurchaseGoodsReceiveNoteComponent', () => {
  let component: PurchaseGoodsReceiveNoteComponent;
  let fixture: ComponentFixture<PurchaseGoodsReceiveNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseGoodsReceiveNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseGoodsReceiveNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

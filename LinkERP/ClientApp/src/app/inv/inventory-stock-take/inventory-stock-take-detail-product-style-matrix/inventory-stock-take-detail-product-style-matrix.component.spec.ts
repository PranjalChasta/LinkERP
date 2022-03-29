import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryStockTakeDetailProductStyleMatrixComponent } from './inventory-stock-take-detail-product-style-matrix.component';

describe('InventoryStockTakeDetailProductStyleMatrixComponent', () => {
  let component: InventoryStockTakeDetailProductStyleMatrixComponent;
  let fixture: ComponentFixture<InventoryStockTakeDetailProductStyleMatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryStockTakeDetailProductStyleMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryStockTakeDetailProductStyleMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

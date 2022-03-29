import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryBarcodeComponent } from './inventory-barcode.component';

describe('InventoryBarcodeComponent', () => {
  let component: InventoryBarcodeComponent;
  let fixture: ComponentFixture<InventoryBarcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryBarcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryProductPriceComponent } from './inventory-product-price.component';

describe('InventoryProductPriceComponent', () => {
  let component: InventoryProductPriceComponent;
  let fixture: ComponentFixture<InventoryProductPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryProductPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryProductPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

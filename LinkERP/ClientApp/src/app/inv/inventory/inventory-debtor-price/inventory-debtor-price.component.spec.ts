import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryDebtorPriceComponent } from './inventory-debtor-price.component';

describe('InventoryDebtorPriceComponent', () => {
  let component: InventoryDebtorPriceComponent;
  let fixture: ComponentFixture<InventoryDebtorPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryDebtorPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryDebtorPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

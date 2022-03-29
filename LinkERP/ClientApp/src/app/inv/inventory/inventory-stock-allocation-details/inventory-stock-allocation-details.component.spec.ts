import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryStockAllocationDetailsComponent } from './inventory-stock-allocation-details.component';

describe('InventoryStockAllocationDetailsComponent', () => {
  let component: InventoryStockAllocationDetailsComponent;
  let fixture: ComponentFixture<InventoryStockAllocationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryStockAllocationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryStockAllocationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

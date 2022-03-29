import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryStockTakeComponent } from './inventory-stock-take.component';

describe('InventoryStockTakeComponent', () => {
  let component: InventoryStockTakeComponent;
  let fixture: ComponentFixture<InventoryStockTakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryStockTakeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryStockTakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

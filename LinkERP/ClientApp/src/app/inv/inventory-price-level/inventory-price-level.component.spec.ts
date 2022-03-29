import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryPriceLevelComponent } from './inventory-price-level.component';

describe('InventoryPriceLevelComponent', () => {
  let component: InventoryPriceLevelComponent;
  let fixture: ComponentFixture<InventoryPriceLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryPriceLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryPriceLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

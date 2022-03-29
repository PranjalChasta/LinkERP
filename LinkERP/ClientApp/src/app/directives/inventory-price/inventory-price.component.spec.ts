import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryPriceComponent } from './inventory-price.component';

describe('InventoryPriceComponent', () => {
  let component: InventoryPriceComponent;
  let fixture: ComponentFixture<InventoryPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

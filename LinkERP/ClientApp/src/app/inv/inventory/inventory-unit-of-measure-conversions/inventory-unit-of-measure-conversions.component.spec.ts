import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryUnitOfMeasureConversionsComponent } from './inventory-unit-of-measure-conversions.component';

describe('InventoryUnitOfMeasureConversionsComponent', () => {
  let component: InventoryUnitOfMeasureConversionsComponent;
  let fixture: ComponentFixture<InventoryUnitOfMeasureConversionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryUnitOfMeasureConversionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryUnitOfMeasureConversionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

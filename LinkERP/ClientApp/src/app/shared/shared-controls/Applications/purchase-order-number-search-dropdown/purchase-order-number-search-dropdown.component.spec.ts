import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderNumberSearchDropdownComponent } from './purchase-order-number-search-dropdown.component';

describe('PurchaseOrderNumberSearchDropdownComponent', () => {
  let component: PurchaseOrderNumberSearchDropdownComponent;
  let fixture: ComponentFixture<PurchaseOrderNumberSearchDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseOrderNumberSearchDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderNumberSearchDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

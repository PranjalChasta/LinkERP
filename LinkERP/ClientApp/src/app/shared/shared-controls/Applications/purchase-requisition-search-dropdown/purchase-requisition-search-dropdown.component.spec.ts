import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseRequisitionSearchDropdownComponent } from './purchase-requisition-search-dropdown.component';

describe('PurchaseRequisitionSearchDropdownComponent', () => {
  let component: PurchaseRequisitionSearchDropdownComponent;
  let fixture: ComponentFixture<PurchaseRequisitionSearchDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseRequisitionSearchDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseRequisitionSearchDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

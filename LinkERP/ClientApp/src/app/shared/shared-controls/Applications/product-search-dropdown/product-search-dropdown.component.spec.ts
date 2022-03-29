import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSearchDropdownComponent } from './product-search-dropdown.component';

describe('ProductSearchDropdownComponent', () => {
  let component: ProductSearchDropdownComponent;
  let fixture: ComponentFixture<ProductSearchDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSearchDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSearchDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

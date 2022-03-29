import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceGroupSearchDropdownComponent } from './price-group-search-dropdown.component';

describe('PriceGroupSearchDropdownComponent', () => {
  let component: PriceGroupSearchDropdownComponent;
  let fixture: ComponentFixture<PriceGroupSearchDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceGroupSearchDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceGroupSearchDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

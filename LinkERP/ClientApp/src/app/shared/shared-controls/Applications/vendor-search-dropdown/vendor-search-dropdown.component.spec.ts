import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSearchDropdownComponent } from './vendor-search-dropdown.component';

describe('VendorSearchDropdownComponent', () => {
  let component: VendorSearchDropdownComponent;
  let fixture: ComponentFixture<VendorSearchDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorSearchDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorSearchDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

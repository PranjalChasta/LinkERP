import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftSearchDropdownComponent } from './shift-search-dropdown.component';

describe('ShiftSearchDropdownComponent', () => {
  let component: ShiftSearchDropdownComponent;
  let fixture: ComponentFixture<ShiftSearchDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftSearchDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftSearchDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

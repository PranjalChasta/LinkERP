import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtorSearchDropdownComponent } from './debtor-search-dropdown.component';

describe('DebtorSearchDropdownComponent', () => {
  let component: DebtorSearchDropdownComponent;
  let fixture: ComponentFixture<DebtorSearchDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebtorSearchDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtorSearchDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

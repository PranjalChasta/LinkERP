import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencySearchDropdownComponent } from './currency-search-dropdown.component';

describe('CurrencySearchDropdownComponent', () => {
  let component: CurrencySearchDropdownComponent;
  let fixture: ComponentFixture<CurrencySearchDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrencySearchDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencySearchDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

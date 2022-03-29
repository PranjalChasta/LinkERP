import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySearchDropdownComponent } from './category-search-dropdown.component';

describe('CategorySearchDropdownComponent', () => {
  let component: CategorySearchDropdownComponent;
  let fixture: ComponentFixture<CategorySearchDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorySearchDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorySearchDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

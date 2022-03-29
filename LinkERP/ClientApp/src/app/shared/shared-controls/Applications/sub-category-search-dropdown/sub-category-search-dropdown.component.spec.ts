import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategorySearchDropdownComponent } from './sub-category-search-dropdown.component';

describe('SubCategorySearchDropdownComponent', () => {
  let component: SubCategorySearchDropdownComponent;
  let fixture: ComponentFixture<SubCategorySearchDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubCategorySearchDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCategorySearchDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

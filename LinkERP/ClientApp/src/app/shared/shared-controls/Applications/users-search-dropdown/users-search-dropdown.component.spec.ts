import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersSearchDropdownComponent } from './users-search-dropdown.component';

describe('UsersSearchDropdownComponent', () => {
  let component: UsersSearchDropdownComponent;
  let fixture: ComponentFixture<UsersSearchDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersSearchDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersSearchDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseSearchDropdownComponent } from './warehouse-search-dropdown.component';

describe('WarehouseSearchDropdownComponent', () => {
  let component: WarehouseSearchDropdownComponent;
  let fixture: ComponentFixture<WarehouseSearchDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseSearchDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseSearchDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

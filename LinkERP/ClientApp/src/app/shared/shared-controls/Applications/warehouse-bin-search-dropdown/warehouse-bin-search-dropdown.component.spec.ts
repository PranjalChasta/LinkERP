import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseBinSearchDropdownComponent } from './warehouse-bin-search-dropdown.component';

describe('WarehouseBinSearchDropdownComponent', () => {
  let component: WarehouseBinSearchDropdownComponent;
  let fixture: ComponentFixture<WarehouseBinSearchDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseBinSearchDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseBinSearchDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

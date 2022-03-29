import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleWarehouseAccessComponent } from './role-warehouse-access.component';

describe('RoleWarehouseAccessComponent', () => {
  let component: RoleWarehouseAccessComponent;
  let fixture: ComponentFixture<RoleWarehouseAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleWarehouseAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleWarehouseAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

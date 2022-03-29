import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleMenuAccessComponent } from './role-menu-access.component';

describe('RoleMenuAccessComponent', () => {
  let component: RoleMenuAccessComponent;
  let fixture: ComponentFixture<RoleMenuAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleMenuAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleMenuAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

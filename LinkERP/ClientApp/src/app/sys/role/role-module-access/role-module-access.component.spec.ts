import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleModuleAccessComponent } from './role-module-access.component';

describe('RoleModuleAccessComponent', () => {
  let component: RoleModuleAccessComponent;
  let fixture: ComponentFixture<RoleModuleAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleModuleAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleModuleAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

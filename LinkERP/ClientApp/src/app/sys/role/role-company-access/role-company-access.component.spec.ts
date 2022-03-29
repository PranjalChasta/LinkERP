import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleCompanyAccessComponent } from './role-company-access.component';

describe('RoleCompanyAccessComponent', () => {
  let component: RoleCompanyAccessComponent;
  let fixture: ComponentFixture<RoleCompanyAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleCompanyAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleCompanyAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

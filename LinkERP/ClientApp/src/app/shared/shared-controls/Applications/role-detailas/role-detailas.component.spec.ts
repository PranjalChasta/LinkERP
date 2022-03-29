import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleDetailasComponent } from './role-detailas.component';

describe('RoleDetailasComponent', () => {
  let component: RoleDetailasComponent;
  let fixture: ComponentFixture<RoleDetailasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleDetailasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleDetailasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

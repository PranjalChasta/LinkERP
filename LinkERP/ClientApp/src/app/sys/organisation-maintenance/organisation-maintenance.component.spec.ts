import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationMaintenanceComponent } from './organisation-maintenance.component';

describe('OrganisationMaintenanceComponent', () => {
  let component: OrganisationMaintenanceComponent;
  let fixture: ComponentFixture<OrganisationMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

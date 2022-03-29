import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AggridOrganisationComponent } from './aggrid-organisation.component';

describe('AggridOrganisationComponent', () => {
  let component: AggridOrganisationComponent;
  let fixture: ComponentFixture<AggridOrganisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AggridOrganisationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AggridOrganisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

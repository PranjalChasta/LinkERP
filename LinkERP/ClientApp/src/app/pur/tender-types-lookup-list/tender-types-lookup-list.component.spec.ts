import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderTypesLookupListComponent } from './tender-types-lookup-list.component';

describe('TenderTypesLookupListComponent', () => {
  let component: TenderTypesLookupListComponent;
  let fixture: ComponentFixture<TenderTypesLookupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenderTypesLookupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenderTypesLookupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

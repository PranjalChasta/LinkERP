import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SopTenderTypesComponent } from './sop-tender-types.component';

describe('SopTenderTypesComponent', () => {
  let component: SopTenderTypesComponent;
  let fixture: ComponentFixture<SopTenderTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SopTenderTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SopTenderTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

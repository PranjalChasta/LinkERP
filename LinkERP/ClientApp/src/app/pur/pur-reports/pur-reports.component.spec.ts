import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurReportsComponent } from './pur-reports.component';

describe('PurReportsComponent', () => {
  let component: PurReportsComponent;
  let fixture: ComponentFixture<PurReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

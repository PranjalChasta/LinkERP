import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SysReportsComponent } from './sys-reports.component';

describe('SysReportsComponent', () => {
  let component: SysReportsComponent;
  let fixture: ComponentFixture<SysReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SysReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

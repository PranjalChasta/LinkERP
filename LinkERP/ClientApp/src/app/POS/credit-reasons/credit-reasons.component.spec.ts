import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditReasonsComponent } from './credit-reasons.component';

describe('CreditReasonsComponent', () => {
  let component: CreditReasonsComponent;
  let fixture: ComponentFixture<CreditReasonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditReasonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

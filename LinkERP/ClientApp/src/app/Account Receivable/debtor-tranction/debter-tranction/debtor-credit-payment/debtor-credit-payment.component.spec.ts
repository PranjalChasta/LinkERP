import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtorCreditPaymentComponent } from './debtor-credit-payment.component';

describe('DebtorCreditPaymentComponent', () => {
  let component: DebtorCreditPaymentComponent;
  let fixture: ComponentFixture<DebtorCreditPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebtorCreditPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtorCreditPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

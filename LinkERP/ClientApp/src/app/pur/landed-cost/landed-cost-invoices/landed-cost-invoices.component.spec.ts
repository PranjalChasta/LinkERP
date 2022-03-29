import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandedCostInvoicesComponent } from './landed-cost-invoices.component';

describe('LandedCostInvoicesComponent', () => {
  let component: LandedCostInvoicesComponent;
  let fixture: ComponentFixture<LandedCostInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandedCostInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandedCostInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

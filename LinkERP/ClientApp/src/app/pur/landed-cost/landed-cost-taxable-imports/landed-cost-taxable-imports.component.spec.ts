import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandedCostTaxableImportsComponent } from './landed-cost-taxable-imports.component';

describe('LandedCostTaxableImportsComponent', () => {
  let component: LandedCostTaxableImportsComponent;
  let fixture: ComponentFixture<LandedCostTaxableImportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandedCostTaxableImportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandedCostTaxableImportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

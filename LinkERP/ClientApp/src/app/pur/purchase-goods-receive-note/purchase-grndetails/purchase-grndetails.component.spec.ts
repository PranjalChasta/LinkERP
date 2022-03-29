import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseGRNDetailsComponent } from './purchase-grndetails.component';

describe('PurchaseGRNDetailsComponent', () => {
  let component: PurchaseGRNDetailsComponent;
  let fixture: ComponentFixture<PurchaseGRNDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseGRNDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseGRNDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

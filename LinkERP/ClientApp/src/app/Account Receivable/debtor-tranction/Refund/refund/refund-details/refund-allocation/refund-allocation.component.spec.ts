import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundAllocationComponent } from './refund-allocation.component';

describe('RefundAllocationComponent', () => {
  let component: RefundAllocationComponent;
  let fixture: ComponentFixture<RefundAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

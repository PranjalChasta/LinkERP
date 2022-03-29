import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceWorkflowComponent } from './price-workflow.component';

describe('PriceWorkflowComponent', () => {
  let component: PriceWorkflowComponent;
  let fixture: ComponentFixture<PriceWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

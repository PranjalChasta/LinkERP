import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseTemplateDetailComponent } from './purchase-template-detail.component';

describe('PurchaseTemplateDetailComponent', () => {
  let component: PurchaseTemplateDetailComponent;
  let fixture: ComponentFixture<PurchaseTemplateDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseTemplateDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseTemplateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

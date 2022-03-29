import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxCodeDetailsComponent } from './tax-code-details.component';

describe('TaxCodeDetailsComponent', () => {
  let component: TaxCodeDetailsComponent;
  let fixture: ComponentFixture<TaxCodeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxCodeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxCodeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

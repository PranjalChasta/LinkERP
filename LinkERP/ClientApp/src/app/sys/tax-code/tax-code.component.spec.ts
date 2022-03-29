import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxCodeComponent } from './tax-code.component';

describe('TaxCodeComponent', () => {
  let component: TaxCodeComponent;
  let fixture: ComponentFixture<TaxCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

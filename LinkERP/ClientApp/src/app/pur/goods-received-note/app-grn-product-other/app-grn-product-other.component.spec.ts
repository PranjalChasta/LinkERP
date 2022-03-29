import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppGrnProductOtherComponent } from './app-grn-product-other.component';

describe('AppGrnProductOtherComponent', () => {
  let component: AppGrnProductOtherComponent;
  let fixture: ComponentFixture<AppGrnProductOtherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppGrnProductOtherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppGrnProductOtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

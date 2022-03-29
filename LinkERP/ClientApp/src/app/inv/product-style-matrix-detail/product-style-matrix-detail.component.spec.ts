import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStyleMatrixDetailComponent } from './product-style-matrix-detail.component';

describe('ProductStyleMatrixDetailComponent', () => {
  let component: ProductStyleMatrixDetailComponent;
  let fixture: ComponentFixture<ProductStyleMatrixDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductStyleMatrixDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductStyleMatrixDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

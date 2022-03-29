import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStyleMatrixComponent } from './product-style-matrix.component';

describe('ProductStyleMatrixComponent', () => {
  let component: ProductStyleMatrixComponent;
  let fixture: ComponentFixture<ProductStyleMatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductStyleMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductStyleMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

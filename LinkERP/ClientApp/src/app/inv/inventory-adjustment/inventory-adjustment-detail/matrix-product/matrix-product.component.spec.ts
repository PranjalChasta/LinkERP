import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixProductComponent } from './matrix-product.component';

describe('MatrixProductComponent', () => {
  let component: MatrixProductComponent;
  let fixture: ComponentFixture<MatrixProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatrixProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrixProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

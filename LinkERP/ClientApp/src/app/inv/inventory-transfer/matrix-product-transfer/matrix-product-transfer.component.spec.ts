import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixProductTransferComponent } from './matrix-product-transfer.component';

describe('MatrixProductTransferComponent', () => {
  let component: MatrixProductTransferComponent;
  let fixture: ComponentFixture<MatrixProductTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatrixProductTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrixProductTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

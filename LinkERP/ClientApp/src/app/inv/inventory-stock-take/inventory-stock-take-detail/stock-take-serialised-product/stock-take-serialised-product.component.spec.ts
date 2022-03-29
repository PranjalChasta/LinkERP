import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTakeSerialisedProductComponent } from './stock-take-serialised-product.component';

describe('StockTakeSerialisedProductComponent', () => {
  let component: StockTakeSerialisedProductComponent;
  let fixture: ComponentFixture<StockTakeSerialisedProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockTakeSerialisedProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockTakeSerialisedProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTakeStyleMatrixrowComponent } from './stock-take-style-matrix-row.component';

describe('StockTakeStyleMatixrowComponent', () => {
  let component: StockTakeStyleMatrixrowComponent;
  let fixture: ComponentFixture<StockTakeStyleMatrixrowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockTakeStyleMatrixrowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockTakeStyleMatrixrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

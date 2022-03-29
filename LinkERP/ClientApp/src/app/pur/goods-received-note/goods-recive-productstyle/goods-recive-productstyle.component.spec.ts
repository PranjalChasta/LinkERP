import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsReciveProductstyleComponent } from './goods-recive-productstyle.component';

describe('GoodsReciveProductstyleComponent', () => {
  let component: GoodsReciveProductstyleComponent;
  let fixture: ComponentFixture<GoodsReciveProductstyleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsReciveProductstyleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsReciveProductstyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

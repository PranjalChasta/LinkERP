import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseNextNumberComponent } from './warehouse-next-number.component';

describe('WarehouseNextNumberComponent', () => {
  let component: WarehouseNextNumberComponent;
  let fixture: ComponentFixture<WarehouseNextNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseNextNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseNextNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryadtustmentOtherComponent } from './inventoryadtustment-other.component';

describe('InventoryadtustmentOtherComponent', () => {
  let component: InventoryadtustmentOtherComponent;
  let fixture: ComponentFixture<InventoryadtustmentOtherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryadtustmentOtherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryadtustmentOtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

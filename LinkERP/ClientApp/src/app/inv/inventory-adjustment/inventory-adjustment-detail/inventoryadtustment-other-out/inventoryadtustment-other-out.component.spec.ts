import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryadtustmentOtherOutComponent } from './inventoryadtustment-other-out.component';

describe('InventoryadtustmentOtherOutComponent', () => {
  let component: InventoryadtustmentOtherOutComponent;
  let fixture: ComponentFixture<InventoryadtustmentOtherOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryadtustmentOtherOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryadtustmentOtherOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

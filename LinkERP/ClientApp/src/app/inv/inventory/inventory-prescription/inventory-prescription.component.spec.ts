import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryPrescriptionComponent } from './inventory-prescription.component';

describe('InventoryPrescriptionComponent', () => {
  let component: InventoryPrescriptionComponent;
  let fixture: ComponentFixture<InventoryPrescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryPrescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

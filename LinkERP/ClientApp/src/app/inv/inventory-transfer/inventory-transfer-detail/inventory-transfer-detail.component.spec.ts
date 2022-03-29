import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryTransferDetailComponent } from './inventory-transfer-detail.component';

describe('InventoryTransferDetailComponent', () => {
  let component: InventoryTransferDetailComponent;
  let fixture: ComponentFixture<InventoryTransferDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryTransferDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryTransferDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryDataImportComponent } from './inventory-data-import.component';

describe('InventoryDataImportComponent', () => {
  let component: InventoryDataImportComponent;
  let fixture: ComponentFixture<InventoryDataImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryDataImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryDataImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

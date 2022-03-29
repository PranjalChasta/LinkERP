import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryKitComponent } from './inventory-kit.component';

describe('InventoryKitComponent', () => {
  let component: InventoryKitComponent;
  let fixture: ComponentFixture<InventoryKitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryKitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryKitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

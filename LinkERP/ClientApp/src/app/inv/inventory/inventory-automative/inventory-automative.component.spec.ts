import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryAutomativeComponent } from './inventory-automative.component';

describe('InventoryAutomativeComponent', () => {
  let component: InventoryAutomativeComponent;
  let fixture: ComponentFixture<InventoryAutomativeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryAutomativeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryAutomativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

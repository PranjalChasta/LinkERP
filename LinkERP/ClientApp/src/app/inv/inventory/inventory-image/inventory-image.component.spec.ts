import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryImageComponent } from './inventory-image.component';

describe('InventoryImageComponent', () => {
  let component: InventoryImageComponent;
  let fixture: ComponentFixture<InventoryImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

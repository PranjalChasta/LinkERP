import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustmentDropdownComponent } from './adjustment-dropdown.component';

describe('AdjustmentDropdownComponent', () => {
  let component: AdjustmentDropdownComponent;
  let fixture: ComponentFixture<AdjustmentDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjustmentDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustmentDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

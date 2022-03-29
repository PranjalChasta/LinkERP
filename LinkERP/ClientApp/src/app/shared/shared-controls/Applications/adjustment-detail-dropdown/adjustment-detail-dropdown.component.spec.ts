import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustmentDetailDropdownComponent } from './adjustment-detail-dropdown.component';

describe('AdjustmentDetailDropdownComponent', () => {
  let component: AdjustmentDetailDropdownComponent;
  let fixture: ComponentFixture<AdjustmentDetailDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjustmentDetailDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustmentDetailDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

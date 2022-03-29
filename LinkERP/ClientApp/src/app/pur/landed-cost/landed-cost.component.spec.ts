import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandedCostComponent } from './landed-cost.component';

describe('LandedCostComponent', () => {
  let component: LandedCostComponent;
  let fixture: ComponentFixture<LandedCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandedCostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandedCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandedCostImportCostComponent } from './landed-cost-import-cost.component';

describe('LandedCostImportCostComponent', () => {
  let component: LandedCostImportCostComponent;
  let fixture: ComponentFixture<LandedCostImportCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandedCostImportCostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandedCostImportCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

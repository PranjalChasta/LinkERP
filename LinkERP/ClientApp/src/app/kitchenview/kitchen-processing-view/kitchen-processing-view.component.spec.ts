import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KitchenProcessingViewComponent } from './kitchen-processing-view.component';

describe('KitchenProcessingViewComponent', () => {
  let component: KitchenProcessingViewComponent;
  let fixture: ComponentFixture<KitchenProcessingViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KitchenProcessingViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KitchenProcessingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

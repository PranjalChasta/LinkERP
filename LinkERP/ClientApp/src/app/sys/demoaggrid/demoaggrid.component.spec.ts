import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoaggridComponent } from './demoaggrid.component';

describe('DemoaggridComponent', () => {
  let component: DemoaggridComponent;
  let fixture: ComponentFixture<DemoaggridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoaggridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoaggridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

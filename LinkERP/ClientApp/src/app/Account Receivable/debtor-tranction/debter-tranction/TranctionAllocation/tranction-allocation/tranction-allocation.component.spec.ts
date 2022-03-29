import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranctionAllocationComponent } from './tranction-allocation.component';

describe('TranctionAllocationComponent', () => {
  let component: TranctionAllocationComponent;
  let fixture: ComponentFixture<TranctionAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranctionAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranctionAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

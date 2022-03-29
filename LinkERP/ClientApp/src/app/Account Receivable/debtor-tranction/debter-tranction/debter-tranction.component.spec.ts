import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebterTranctionComponent } from './debter-tranction.component';

describe('DebterTranctionComponent', () => {
  let component: DebterTranctionComponent;
  let fixture: ComponentFixture<DebterTranctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebterTranctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebterTranctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousTranctionComponent } from './previous-tranction.component';

describe('PreviousTranctionComponent', () => {
  let component: PreviousTranctionComponent;
  let fixture: ComponentFixture<PreviousTranctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousTranctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousTranctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

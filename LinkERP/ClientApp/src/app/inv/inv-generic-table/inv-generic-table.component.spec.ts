import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvGenericTableComponent } from './inv-generic-table.component';

describe('InvGenericTableComponent', () => {
  let component: InvGenericTableComponent;
  let fixture: ComponentFixture<InvGenericTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvGenericTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvGenericTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericTableDataComponent } from './generic-table-data.component';

describe('GenericTableDataComponent', () => {
  let component: GenericTableDataComponent;
  let fixture: ComponentFixture<GenericTableDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericTableDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericTableDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

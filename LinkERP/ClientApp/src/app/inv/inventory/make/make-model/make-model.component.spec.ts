import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeModelComponent } from './make-model.component';

describe('MakeModelComponent', () => {
  let component: MakeModelComponent;
  let fixture: ComponentFixture<MakeModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

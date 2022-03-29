import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiateInternalTransfersComponent } from './initiate-internal-transfers.component';

describe('InitiateInternalTransfersComponent', () => {
  let component: InitiateInternalTransfersComponent;
  let fixture: ComponentFixture<InitiateInternalTransfersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitiateInternalTransfersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiateInternalTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

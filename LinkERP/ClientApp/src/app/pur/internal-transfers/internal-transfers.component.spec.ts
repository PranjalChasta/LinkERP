import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalTransfersComponent } from './internal-transfers.component';

describe('InternalTransfersComponent', () => {
  let component: InternalTransfersComponent;
  let fixture: ComponentFixture<InternalTransfersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalTransfersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

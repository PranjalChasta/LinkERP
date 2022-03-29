import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialisedProductTransferOutComponent } from './serialised-product-transfer-out.component';

describe('SerialisedProductTransferOutComponent', () => {
  let component: SerialisedProductTransferOutComponent;
  let fixture: ComponentFixture<SerialisedProductTransferOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerialisedProductTransferOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerialisedProductTransferOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

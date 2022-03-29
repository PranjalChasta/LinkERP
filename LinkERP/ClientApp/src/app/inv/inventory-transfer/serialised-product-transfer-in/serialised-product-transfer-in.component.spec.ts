import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialisedProductTransferInComponent } from './serialised-product-transfer-in.component';

describe('SerialisedProductTransferInComponent', () => {
  let component: SerialisedProductTransferInComponent;
  let fixture: ComponentFixture<SerialisedProductTransferInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerialisedProductTransferInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerialisedProductTransferInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialisedProductComponent } from './serialised-product.component';

describe('SerialisedProductComponent', () => {
  let component: SerialisedProductComponent;
  let fixture: ComponentFixture<SerialisedProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerialisedProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerialisedProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

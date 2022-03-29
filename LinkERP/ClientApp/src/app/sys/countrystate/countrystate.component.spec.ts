import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountrystateComponent } from './countrystate.component';

describe('CountrystateComponent', () => {
  let component: CountrystateComponent;
  let fixture: ComponentFixture<CountrystateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountrystateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountrystateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

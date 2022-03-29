import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountrystatecityComponent } from './countrystatecity.component';

describe('CountrystatecityComponent', () => {
  let component: CountrystatecityComponent;
  let fixture: ComponentFixture<CountrystatecityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountrystatecityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountrystatecityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

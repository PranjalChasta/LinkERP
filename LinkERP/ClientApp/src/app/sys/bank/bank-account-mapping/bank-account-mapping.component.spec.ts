import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountMappingComponent } from './bank-account-mapping.component';

describe('BankAccountMappingComponent', () => {
  let component: BankAccountMappingComponent;
  let fixture: ComponentFixture<BankAccountMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankAccountMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAccountMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

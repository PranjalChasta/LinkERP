import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilityBackUPDataBaseComponent } from './utility-back-updata-base.component';

describe('UtilityBackUPDataBaseComponent', () => {
  let component: UtilityBackUPDataBaseComponent;
  let fixture: ComponentFixture<UtilityBackUPDataBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtilityBackUPDataBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilityBackUPDataBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

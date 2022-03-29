import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WareHouseBinComponent } from './ware-house-bin.component';

describe('WareHouseBinComponent', () => {
  let component: WareHouseBinComponent;
  let fixture: ComponentFixture<WareHouseBinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WareHouseBinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WareHouseBinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocMastersComponent } from './doc-masters.component';

describe('DocMastersComponent', () => {
  let component: DocMastersComponent;
  let fixture: ComponentFixture<DocMastersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocMastersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

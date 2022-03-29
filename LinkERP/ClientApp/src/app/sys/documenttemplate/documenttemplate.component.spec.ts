import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumenttemplateComponent } from './documenttemplate.component';

describe('DocumenttemplateComponent', () => {
  let component: DocumenttemplateComponent;
  let fixture: ComponentFixture<DocumenttemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumenttemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumenttemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

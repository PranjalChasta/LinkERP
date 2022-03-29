import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDocumentTemplateComponent } from './report-document-template.component';

describe('ReportDocumentTemplateComponent', () => {
  let component: ReportDocumentTemplateComponent;
  let fixture: ComponentFixture<ReportDocumentTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportDocumentTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDocumentTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

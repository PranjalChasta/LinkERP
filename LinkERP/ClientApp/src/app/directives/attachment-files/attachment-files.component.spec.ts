import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentFilesComponent } from './attachment-files.component';

describe('AttachmentFilesComponent', () => {
  let component: AttachmentFilesComponent;
  let fixture: ComponentFixture<AttachmentFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

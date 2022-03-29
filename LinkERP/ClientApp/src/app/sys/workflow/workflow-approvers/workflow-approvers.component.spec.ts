import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowApproversComponent } from './workflow-approvers.component';

describe('WorkflowApproversComponent', () => {
  let component: WorkflowApproversComponent;
  let fixture: ComponentFixture<WorkflowApproversComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowApproversComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowApproversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

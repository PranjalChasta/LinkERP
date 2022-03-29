import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoAccessPermissionComponent } from './no-access-permission.component';

describe('NoAccessPermissionComponent', () => {
  let component: NoAccessPermissionComponent;
  let fixture: ComponentFixture<NoAccessPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoAccessPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoAccessPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

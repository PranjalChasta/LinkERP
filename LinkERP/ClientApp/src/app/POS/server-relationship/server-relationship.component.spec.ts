import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerRelationshipComponent } from './server-relationship.component';

describe('ServerRelationshipComponent', () => {
  let component: ServerRelationshipComponent;
  let fixture: ComponentFixture<ServerRelationshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerRelationshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerRelationshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

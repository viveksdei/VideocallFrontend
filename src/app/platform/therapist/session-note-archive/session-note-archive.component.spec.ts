import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionNoteArchiveComponent } from './session-note-archive.component';

describe('SessionNoteArchiveComponent', () => {
  let component: SessionNoteArchiveComponent;
  let fixture: ComponentFixture<SessionNoteArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessionNoteArchiveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SessionNoteArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

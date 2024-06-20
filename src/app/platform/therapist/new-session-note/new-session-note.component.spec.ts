import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSessionNoteComponent } from './new-session-note.component';

describe('NewSessionNoteComponent', () => {
  let component: NewSessionNoteComponent;
  let fixture: ComponentFixture<NewSessionNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewSessionNoteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewSessionNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousSessionNoteComponent } from './previous-session-note.component';

describe('PreviousSessionNoteComponent', () => {
  let component: PreviousSessionNoteComponent;
  let fixture: ComponentFixture<PreviousSessionNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreviousSessionNoteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreviousSessionNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

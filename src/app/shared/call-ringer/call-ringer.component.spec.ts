import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallRingerComponent } from './call-ringer.component';

describe('CallRingerComponent', () => {
  let component: CallRingerComponent;
  let fixture: ComponentFixture<CallRingerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CallRingerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CallRingerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

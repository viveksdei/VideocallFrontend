import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounselingHistoryComponent } from './counseling-history.component';

describe('CounselingHistoryComponent', () => {
  let component: CounselingHistoryComponent;
  let fixture: ComponentFixture<CounselingHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CounselingHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CounselingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

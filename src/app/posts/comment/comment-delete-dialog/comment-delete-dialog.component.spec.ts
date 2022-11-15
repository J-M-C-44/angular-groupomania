import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentDeleteDialogComponent } from './comment-delete-dialog.component';

describe('CommentDeleteDialogComponent', () => {
  let component: CommentDeleteDialogComponent;
  let fixture: ComponentFixture<CommentDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentDeleteDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

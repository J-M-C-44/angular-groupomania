import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-comment-edit-dialog',
  templateUrl: './comment-edit-dialog.component.html',
  styleUrls: ['./comment-edit-dialog.component.scss']
})
export class CommentEditDialogComponent implements OnInit {

  constructor(
    // @Optional() public dialogRef: MatDialogRef<CommentEditDialogComponent>,
    public dialogRef: MatDialogRef<CommentEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }
 
  close() {
    this.dialogRef.close();
  }
}

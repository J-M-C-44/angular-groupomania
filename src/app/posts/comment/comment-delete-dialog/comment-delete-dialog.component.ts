import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-comment-delete-dialog',
  templateUrl: './comment-delete-dialog.component.html',
  styleUrls: ['./comment-delete-dialog.component.scss']
})
export class CommentDeleteDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<CommentDeleteDialogComponent>
  ) { }

  ngOnInit(): void {
  }


  cancel() {
    this.dialogRef.close();
  }

  delete() {
    this.dialogRef.close(true);
  }

}
 
  
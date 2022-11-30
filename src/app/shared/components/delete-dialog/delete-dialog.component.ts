// ICIJCO: à passer en mutualisé car utilisé par post aussi --> "commentaire" ou "post" + message différent
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})

export class DeleteDialogComponent implements OnInit {

  elementType = ''

  constructor(
    private dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    switch (this.data.type) {
      case "comment":
        this.elementType = 'commentaire';
        break;
      case "post":
        this.elementType = 'post';
        break;
      case "user":
        this.elementType = 'utilisateur';
        break;
      default:
        this.elementType = 'élément';
    }


  }


  cancel() {
    this.dialogRef.close();
  }

  delete() {
    this.dialogRef.close(true);
  }

}
 
  
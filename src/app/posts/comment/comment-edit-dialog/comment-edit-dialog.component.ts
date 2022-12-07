// <--------------  gestion de l'édition d'un commentaire  : fenetre de dialogue         ------------->
// <--------------     - appel par comment.component                                     ------------->

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-comment-edit-dialog',
  templateUrl: './comment-edit-dialog.component.html',
  styleUrls: ['./comment-edit-dialog.component.scss']
})

/** boite de dialogue appelée par comment.component
 * données injectées en entrée : 
 *    - postExt   => post où est rattaché le commentaire à éditer
 *    - comment   => commentaire à éditer  
 * appelle à son tour app-comment-form via template
 */
export class CommentEditDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CommentEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }
 
  close() {
    this.dialogRef.close();
  }
}

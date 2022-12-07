
// <--------------  gestion de l'édition d'un post  : fenetre de dialogue         ------------->
// <--------------     - appel par post.component                                 ------------->

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-post-edit-dialog',
  templateUrl: './post-edit-dialog.component.html',
  styleUrls: ['./post-edit-dialog.component.scss']
})

/** boite de dialogue appelée par post.component
 * données injectées en entrée : 
 *    - postExt   => post à modifier 
 *    - postsExt  => tableau des posts  
 * appelle à son tour post-form via template
 */
export class PostEditDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PostEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  close() :void {
    this.dialogRef.close();
  }
}

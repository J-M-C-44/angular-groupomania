// <------------------    boite de dialogue mutualisée de demande de confirmation de suppression     --------->
// <------------------       appelée par les components: user-edit-dialog, user, post, comment       --------->

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})

/** adapte le contenu de la boite de dialogue de demande de confirmation de suppression selon la donnée injectée en entrée: "type".
 *  Le type correspond à 'posts', 'comment', 'user', 'myUser'.
 *  Renvoie "true" à la fermeture de la fenetre de dialog si demande suppression confirmée par l'utilisateur  
 */
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
      case "myUser":
        this.elementType = 'compte';
        break;
      default:
        this.elementType = 'élément';
    }
  }

  cancel() :void {
    this.dialogRef.close();
  }

  delete() :void {
    this.dialogRef.close(true);
  }

}
 
  
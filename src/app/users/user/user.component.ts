// <--------------  gestion  de l'affichage unitaire des données d'un utilisateur  -  appelé via template par users-list      ------------->

import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { UsersService } from '../../shared/services/users.service';
import { User, UserExtended } from '../../shared/models/user.model';
import {DeleteDialogComponent} from '../../shared/components/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog'
import { SnackBarService } from '../../shared/services/snack-bar.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

/** gestion l'affichage des données d'un seul utilisateur + possibilité de supprimer le compte pour l'admin 
 */
export class UserComponent implements OnInit {

  // données en provenance du composant parent (users-list) et qui seront également mises à jour
  @Input() usersExt!: UserExtended[];
  @Input() userExt!: UserExtended;
  @Input() userIsAdmin! : boolean;
  @Input() userId! : number;

  constructor(
    private snackBarService: SnackBarService,
    private usersService: UsersService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    
  }

/** gestion la demande de suppression de compte: 
 *     - ouvre la fenetre de dialogue demandant la confirmation de suppression du compte
 *     - si confirmée: 
 *           - suppression du compte en bdd appel API via user service
 *           - mise à jour de la liste des users pour affichage
 */
  openDialogDelete() : void {
    console.log('openDialogDelete')
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
     data: {
       type: 'user',
     },
    });

    dialogRef.afterClosed().subscribe(deleteIsConfirmed => {
      if (deleteIsConfirmed)  {
        this.usersService.deleteUser(this.userExt.id)
          .subscribe ( {  
            next : (data) => {
              this.snackBarService.openSnackBar('user supprimé','');
              // on supprime l'utilisateur de la liste des utilisateurs utilisée pour l'affichage 
              const index: number = this.usersExt.indexOf(this.userExt);
              if (index !== -1) {
                this.usersExt.splice(index, 1);
              }
              console.log('this.usersExt :', this.usersExt);
            },
            error: (err) => {
              console.log('suppression user  ko : ', err);
              let errorMsgSubmit = 'suppression utilisateur échouée: ' + err
              this.snackBarService.openSnackBar(errorMsgSubmit,'','','', '', 'snack-style--ko');
            },
          })
      };
    });
}
}

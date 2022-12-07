// <--------------  gestion de l'édition des données de l'utilisateur : fenetre de dialogue               ------------->
// <--------------     * accès : via bouton toolbar                                                       ------------->
// <--------------     * appels via template  : user-profile-form, user-email-form, user-password-form    ------------->


import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserExtended } from 'src/app/shared/models/user.model';
import { UsersService } from '../../shared/services/users.service';
import { MatDialog } from '@angular/material/dialog'
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { DeleteDialogComponent } from '../../shared/components/delete-dialog/delete-dialog.component';
import { TokenService } from 'src/app/core/services/token.service';



@Component({
  selector: 'app-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  styleUrls: ['./user-edit-dialog.component.scss']
})


/** gestion des modifications des données d'un utilisateur : 
 *     - récupération des données de l'utilisateur en cours d'édition
 *     - modification par appel à des composants dédiés (template) pour : profil, email, password 
 *     - modification directe pour la demande de suppression de compte ( fenetre dialogue-delete puis appel API via user service) 
 *     - mise à jour des données pour l'affichage
 */
export class UserEditDialogComponent implements OnInit {
  //user id de l'utilisateur actuel
  myUserId = 0;
  userIsAdmin = false;
  editedUser: UserExtended = {id:0,email:'', lastname:'',firstname:'',fonction:'',avatarUrl:'', role:0, createdTime:'',modifiedTime:'', fullName:''};
  defaultAvatarUrl ='/assets/logo-avatar.jpg';
  titre = '';
  
  constructor(
    public dialogRef: MatDialogRef<UserEditDialogComponent>,
    private usersService: UsersService,
    private snackBarService: SnackBarService,
    private dialog: MatDialog,
    private tokenService: TokenService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {

    // les données du user actuel sont nécessaires pour l'affichage/utilisation de certaines fonctions.
    // on utilise des données du user actuel si on les a déjà ( elles sont stockées temporairement dans le service user)
    if (this.usersService.myUser.id !=0) {
      this.myUserId = this.usersService.myUser.id,
      this.usersService.myUser.role! > 0 ? this.userIsAdmin = true : this.userIsAdmin = false;

      //si on n'a pas les données du user actuel, on les récupère sur l'api (via service user)
    } else { 
        this.usersService.getMyUser()
          .subscribe ( {
            next : (data) => {
              console.log('données getMyUser reçues : ', data);
              this.myUserId = data.id
              data.role! > 0 ? this.userIsAdmin = true : this.userIsAdmin = false; 
            }
            ,
            error: (err) => {
              console.log('données getMyUser  ko : ', err);
              this.router.navigateByUrl('/auth/login')
            },
          }) 
    }
  
    this.editedUser.id = (this.data.userId == 'me') ? this.myUserId : this.data.userId ;
    
    // on cherche les données du user en cours d'édition dans le cache géré par le service user
    let userFoundinCache =  this.usersService.UsersExtendedCache.find(searchItem => (searchItem.id == this.editedUser.id))
    if (userFoundinCache) {
      this.editedUser = userFoundinCache;

      //si on n'a pas les données, on les récupère sur l'api (via service user)
    } else {
      this.usersService.getOneUser(this.editedUser.id)
        .subscribe ( {
          next : (data) => {
            let fullName = this.usersService.formatFullName(data.id, data.lastname, data.firstname)  
            this.editedUser = {...data, fullName}
            this.editedUser.avatarUrl = data.avatarUrl ? data.avatarUrl : this.defaultAvatarUrl;
          },

          error: (err) => {
            console.log('données getOneUser  ko : ', err);
            this.editedUser.avatarUrl = this.defaultAvatarUrl
            this.editedUser.fullName = ('utilisateur n° ' + this.editedUser.id) 
          },
        }) 
    }
    this.titre = (this.data.userId == 'me') ? 'Modifier votre profil' : ('Modifier le profil de '+this.editedUser.fullName) ;
  }

/** gestion la demande de suppression de compte: 
 *     - ouvre la fenetre de dialogue demandant la confirmation de suppression du compte
 *     - si confirmée: 
 *           - suppression du compte en bdd appel API via user service
 *           - si c'est pour son propre compte : suppression du token et des données utilisateurs stockées temporairement puis déconnection
 */
  openDialogDelete() : void {
    console.log('openDialogDelete')
    let dataType = (this.data.userId == 'me') ? 'myUser' : 'user';
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
     data: {
       type: dataType,
     },
    });

    dialogRef.afterClosed().subscribe(deleteIsConfirmed => {
      if (deleteIsConfirmed)  {
        console.log(`deleteIsConfirmed : ${deleteIsConfirmed}`) ;
        this.usersService.deleteUser(this.editedUser.id )
          .subscribe ( {  
            next : (data) => {
              this.snackBarService.openSnackBar('user supprimé','');
              if (this.data.userId == 'me') {
                this.tokenService.deleteToken();
                this.usersService.eraseMyUserData();
                this.dialogRef.close();
                this.router.navigateByUrl('/auth/signup');
              } 
              
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

  close() :void {
    this.dialogRef.close();
  }
}

// <--------------  gestion de la liste des utilisateurs : accès via bouton toolbar ou saisie url ---------->

import { Component, OnInit } from '@angular/core';
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { UsersService } from '../../shared/services/users.service';
import { Router } from '@angular/router';
import { User, UserExtended } from '../../shared/models/user.model';
import { trigger, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  // animation gérant - l'apparition progressive par le bas des utilisateurs (:enter),
  //                   - l'inverse pour la suppression d'un utilisateur (:leave)
  animations: [
    trigger('animFromBottom', [
      transition(':enter', [
        style({
            opacity: 0,
            transform: 'translateY(+100%)',
        }),
        animate('300ms ease-out',
                style({ 
                      opacity: 1,
                      transform: 'translateY(0)'
                })
        )
      ]),
      transition(':leave', [
        style({
          opacity: 1,
          transform: 'translateY(0)',
        }),
        animate('250ms ease-in',
                style({ 
                      opacity: 0,
                      transform: 'translateY(+100%)',
                      
                })
        ),
      ]),
    ])
  ]
})

/**
 * gestion de la liste des utilisateurs : 
 *   - recherche l'ensemble des utilisateurs :
 *       - dans le tableau de cache utilisateur si celui-ci est complet
 *       - côté API (via le service user) sinon
 *   - prépare les données nécessaires à l'affichage des utilisateurs 
 *   - affiche "unitairement" chacun des utilisateurs via le composant enfant user ( cf template)
 */
export class UsersListComponent implements OnInit {
  // userId de l'utisateur actuel
  myUserId = 0;
  userIsAdmin = false;
  users:User[] =[];
  // tableau des utilisateurs avec complément de données. Sert de référence pour l'affichage.
  usersExt:UserExtended[] =[];
  detailedUser: UserExtended = {id:0,email:'', lastname:'',firstname:'',fonction:'',avatarUrl:'', role:0, createdTime:'',modifiedTime:'', fullName:''}
  defaultAvatarUrl ='assets/logo-avatar.jpg' 

  constructor(
    private snackBarService: SnackBarService,
    private usersService: UsersService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    // les données du user actuel sont nécessaires pour l'affichage/utilisation de certaines fonctions.
    // on utilise des données du user actuel si on les a déjà ( elles sont stockées temporairement dans le service user)
    if (this.usersService.myUser.id !=0) {
      this.myUserId = this.usersService.myUser.id,
      this.usersService.myUser.role! > 0 ? this.userIsAdmin = true : this.userIsAdmin = false;

      // puis on récupère tous les utilisateurs de la bdd
      this.getAllUsers();

    //si on n'a pas les données du  user actuel, on les récupère sur l'api (via service user)
    } else { 
        this.usersService.getMyUser()
          .subscribe ( {
            next : (data) => {
              // console.log('données getMyUser reçues : ', data);
              this.myUserId = data.id
              data.role! > 0 ? this.userIsAdmin = true : this.userIsAdmin = false;

              // puis on récupère tous les utilisateurs de la bdd
              this.getAllUsers() 
            }
            ,
            error: (err) => {
              console.log('données getMyUser  ko : ', err);
              this.router.navigateByUrl('/auth/login')
            },
          }) 
    }
  }

/**
 *  - constitution de la liste de l'ensemble des utilisateurs :
 *       - recherche dans le tableau de cache utilisateur si celui-ci est complet
 *       - recherche côté API sinon (via le service user qui les mettra en cache )
 */
  getAllUsers() :void {
    // si toutes les données sont déjà en cache, on les récupères directement
    if (this.usersService.UsersExtendedCacheFullyCharged) {
      this.usersExt = this.usersService.UsersExtendedCache

    // sinon on les récupères après appel API
    } else {
      this.usersService.getAllUsers()
          .subscribe ( {
            next : (data) => {
              // console.log('données getAllUsers reçues : ', data);
              // le user service a mis toutes les données étendues en cache, on les récupère
              this.usersExt = this.usersService.UsersExtendedCache

            },
            error: (err) => {
              console.log('données getAllUserss  ko : ', err);
              let errorMsgSubmit = 'récupération des Users échouée: ' + err
              this.snackBarService.openSnackBar(errorMsgSubmit,'','','', '', 'snack-style--ko');
            },
          })    

    }
    
  }

};


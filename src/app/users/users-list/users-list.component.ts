import { Component, OnInit } from '@angular/core';

import { SnackBarService } from '../../shared/services/snack-bar.service';
import { UsersService } from '../../shared/services/users.service';
// import { PageEvent } from '@angular/material/paginator';
import {Router} from '@angular/router';
import { User, UserExtended } from '../../shared/models/user.model';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
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
export class UsersListComponent implements OnInit {
  myUserId = 0;
  detailedUser: UserExtended = {id:0,email:'', lastname:'',firstname:'',fonction:'',avatarUrl:'', role:0, createdTime:'',modifiedTime:'', fullName:''}
  userIsAdmin = false;
  users:User[] =[];
  usersExt:UserExtended[] =[];
  defaultAvatarUrl ='assets/logo-avatar.jpg' 

  constructor(
    private snackBarService: SnackBarService,
    // private PostsService: PostsService,
    private usersService: UsersService,
    // private LikesService: LikesService,
    // private CommentsService: CommentsService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    // on vérifie si on n'a pas déjà les données du user actuel avant d'aller les chercher
    if (this.usersService.myUser.id !=0) {
      this.myUserId = this.usersService.myUser.id,
      this.usersService.myUser.role! > 0 ? this.userIsAdmin = true : this.userIsAdmin = false;

      this.getAllUsers();

    } else { 
        this.usersService.getMyUser()
          .subscribe ( {
            next : (data) => {
              console.log('données getMyUser reçues : ', data);
              this.myUserId = data.id
              data.role! > 0 ? this.userIsAdmin = true : this.userIsAdmin = false;
              // if (data.avatarUrl) {
              //   this.avatarUrl = data.avatarUrl;
              // }
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

  getAllUsers() :void {
    // si toutes les données sont déjà en cache, on les récupères directement
    if (this.usersService.UsersExtendedCacheFullyCharged) {
      this.usersExt = this.usersService.UsersExtendedCache

    // sinon on les récupères après appel API
    } else {
      this.usersService.getAllUsers()
          .subscribe ( {
            next : (data) => {
              console.log('données getAllUsers reçues : ', data);
              // this.users = data;
              // le user service a mis toutes les données étendues en cache, on les récupère
              this.usersExt = this.usersService.UsersExtendedCache

              // for (let user of this.users) {
              //   // on créé le tableau des données "users étendues" servant à l'affichage
              //   //ICIJCO: penser à refactorer le code des autres endroits où on gère le fullname
              //   let fullName = this.usersService.formatFullName(user.id, user.lastname, user.firstname)
              //   let newUserExt = {...user, fullName:fullName}
              //   newUserExt.avatarUrl = user.avatarUrl ? user.avatarUrl : this.defaultAvatarUrl;
              //   console.log('newUsertExt : ', newUserExt)
              //   this.usersExt.push(newUserExt)
              // }
              // // on enregistre en cache l'ensemble des users vu qu'on les a tous récupérés 
              // this.usersService.UsersExtendedCache = this.usersExt
              // this.usersService.UsersExtendedCacheFullyCharged = true;

            },
            error: (err) => {
              console.log('données getAllUserss  ko : ', err);
              //this.errorMsgSubmit
              let errorMsgSubmit = 'récupération des Users échouée: ' + err
              this.snackBarService.openSnackBar(errorMsgSubmit,'','','', '', 'snack-style--ko');
            },
           // complete: () => console.info('complete')
          })    

    }
    
  }

};


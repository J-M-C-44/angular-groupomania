// <-------------          service users : tout ce que tourne autour du user            ------------>

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User, UserExtended } from '../models/user.model';
import {Router} from '@angular/router';
import { __param } from 'tslib';

const baseUrl = 'http://localhost:3000/api/v1/'

@Injectable({
  providedIn: 'root'
})

/** regroupe toutes les fonctions relatives aux utilisateurs :
 *     - récupération des users sur l'API : un user, son user, tous les users
 *     - mise à jour du user via l'API : profil (dont avatar), email, mot de passe
 *     - suppression du user via l'API
 *     - mise en cache des informations users pour ne pas appeler l'API pour des données qui ne bougent pas bcp.
 *     - ...
 */
export class UsersService {

  private usersUrl = baseUrl+'users/';
  // tableau de cache contenant les users + autre info utile
  public UsersExtendedCache: UserExtended[] =[]
  public UsersExtendedCacheFullyCharged = false;
  // cache des infos du user actuellement connecté 
  public myUser:User = {id:0,email:'', lastname:'',firstname:'',fonction:'',avatarUrl:'', role:0, createdTime:'',modifiedTime:''}
  defaultAvatarUrl ='assets/logo-avatar.jpg' 
  avatarUrl ='';    

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(
    private http: HttpClient,
    private router: Router,
    ) { }


/** récupère le user via get htttp sur l'api 
 *    (et les met en cache)
 * @param userId - id du user à récupérer
 * @returns un user
 */
  getOneUser(userId:number): Observable<User> {
      return this.http.get<User>(this.usersUrl+userId)
          .pipe(
            tap((data: any) => {
              // console.log('données reçues : ', data)
               //mise en cache 
              this.putUserInCache(data) 
            }),
              
            catchError(err => {
              console.log('err : ', err);
              if (!err.status) {
                  err = 'serveur non accessible'  
              } else if (err.status == 404) {
                  err = 'non trouvé'  
              
              } else if (err.status == 500) {
                err = 'erreur interne serveur'  
  
              } else {
                  err = err.error.message
              } 
              throw err;
            })
          )
   
  }

  /** récupère via get htttp sur l'API le user de l'utilisateur actuellement connecté 
 *    (et le met en cache)
 * @returns un user
 */
  getMyUser(): Observable<User> {
    return this.http.get<User>(this.usersUrl+'me')
        .pipe(
          tap((data: any) =>  {
            // console.log('données reçues : ', data)
            this.myUser = {...data}
            // console.log('this.myUser : ', this.myUser)  
            //mise en cache 
            this.putUserInCache(data) 
          }) 
            ,
          catchError(err => {
            console.log('err : ', err);
            // this.router.navigateByUrl('/auth/login'); 
            throw err;
          })
        )
 
}

 /** récupère via get htttp sur l'API tous les users 
 *    (et les met en cache)
 * @returns un tableau de user
 */
  getAllUsers() : Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl)
          .pipe(
            tap((data: any) => {
              // console.log('données reçues : ', data)
               //mise en cache 
              this.putAllUsersInCache(data) 
            }),
              
            catchError(err => {
              console.log('err : ', err);
              if (!err.status) {
                  err = 'serveur non accessible'  
              } else if (err.status == 404) {
                  err = 'non trouvé'  
              
              } else if (err.status == 500) {
                err = 'erreur interne serveur'  
  
              } else {
                  err = err.error.message
              } 
              throw err;
            })
          )
  }

/** supprime le user via delete htttp sur l'API
 *    (et le supprime du cache)
 *  @param userId - id du user à supprimer
 */
  deleteUser (userId:number): Observable<User> {
    return this.http.delete<User>(this.usersUrl+userId)
        .pipe(
          tap((data: any) => {
            // console.log('données deletePost  : ', data)
            // on supprime le user du cache
            this.UsersExtendedCache= this.UsersExtendedCache.filter(p => p.id !== userId);
          }),
          catchError(err => {
              // console.log('err : ', err);
            if (!err.status) {
                err = 'serveur non accessible'  
            } else if (err.status == 404) {
                err = 'non trouvé'  
            
            } else if (err.status == 500) {
              err = 'erreur interne serveur'  
 
            } else {
                err = err.error.message
            } 
            throw err;
          })
        )
  }
/** met à jour le user (données nom, prénom, fonction et avatar éventuellement) via put htttp sur l'API
 *    (et le supprime du cache)
 *  @param editedUser : user "étendu" en cours d'édition
 *  @param lastname : user "étendu" en cours d'édition
 *  @param firstname : user "étendu" en cours d'édition
 *  @param fonction : user "étendu" en cours d'édition
 *  @param {File|string} avatar  : fichier image de l'avatar ou 'toDelete' si demande de suppression de l'image existante
 */
  updateProfileUser(editedUser:UserExtended, lastname:string, firstname:string, fonction:string, avatar?:File|string, ) : Observable<User> {
    if (avatar && (avatar != 'toDelete')) {
      //form data pour gérer le fichier
      const formData: FormData = new FormData();
      let user = { id : editedUser.id, lastname: lastname, firstname:firstname, fonction:fonction}
      formData.append('user', JSON.stringify(user));
      formData.append('image', avatar);
      return this.http.put(this.usersUrl+editedUser.id+'/profile', formData, this.httpOptions)
          .pipe(
            tap((data: any) => {
              // console.log('données put user profile  : ', data)
              // on met à jour le user en cache (et myUser si concerné)
              this.UsersExtendedCache= this.UsersExtendedCache.filter(p => p.id !== editedUser.id);
              editedUser.lastname = lastname;
              editedUser.firstname = firstname;
              editedUser.fonction = fonction;
              editedUser.avatarUrl = data.avatarUrl;
              this.UsersExtendedCache.push(editedUser);
              if (editedUser.id == this.myUser.id) {
                this.myUser.lastname = lastname;
                this.myUser.firstname = firstname;
                this.myUser.fonction = fonction;
                this.myUser.avatarUrl = data.avatarUrl;
              }
            }),
            catchError(err => {
               console.log('err : ', err);
              if (!err.status) {
                  err = 'serveur non accessible'  
              } else if (err.status == 500) {
                  err = 'erreur interne serveur' 
              } else if (err.status == 404) {
                  err = 'non trouvé'   
              } else {
                  err = err.error.message
              } 
              throw err;
            })
          )
    } else {
      // JSON 
        let body = {} 
        let id = editedUser.id
        let isAvatarDeleted = false
        if (avatar && (avatar == 'toDelete')) {
          isAvatarDeleted = true;
          let avatarUrl = avatar
          body = {id, lastname, firstname, fonction, avatarUrl}; 
        } else {
          body = {id, lastname, firstname, fonction}
        }
        return this.http.put(this.usersUrl+editedUser.id+'/profile', body, this.httpOptions)
          .pipe(
            tap((data: any) => {
              // console.log('données put user profile  : ', data)
              // on met à jour le user en cache (et myUser si concerné)
              this.UsersExtendedCache= this.UsersExtendedCache.filter(p => p.id !== editedUser.id);
              editedUser.lastname = lastname;
              editedUser.firstname = firstname;
              editedUser.fonction = fonction;
              if (isAvatarDeleted) {
                editedUser.avatarUrl = this.defaultAvatarUrl;
              }
              this.UsersExtendedCache.push(editedUser);
              if (editedUser.id == this.myUser.id) {
                this.myUser.lastname = lastname;
                this.myUser.firstname = firstname;
                this.myUser.fonction = fonction;
                if (isAvatarDeleted) {
                  this.myUser.avatarUrl = this.defaultAvatarUrl;
                }
                
              }
            }),
            catchError(err => {
              // console.log('err : ', err);
              if (!err.status) {
                err = 'serveur non accessible'  
            } else if (err.status == 500) {
                err = 'erreur interne serveur' 
            } else if (err.status == 404) {
                err = 'non trouvé'   
            } else {
                err = err.error.message
            } 
              throw err;
            })
          )
      };
  }

/** met à jour l'email via l'API
 *    (et met à jour le cache)
 *  @param editedUser : user "étendu" en cours d'édition
 *  @param email : nouvel email 
 */
  updateEmailUser(editedUser:UserExtended, email:string): Observable<User> {
    let body = {email};
    return this.http.patch(this.usersUrl+editedUser.id+'/email', body, this.httpOptions)
          .pipe(
            tap((data: any) => {
              // console.log('données patch user email  : ', data)
              // on met à jour le user en cache (et myUser si concerné)
              this.UsersExtendedCache= this.UsersExtendedCache.filter(p => p.id !== editedUser.id);
              editedUser.email = email
              this.UsersExtendedCache.push(editedUser);
              if (editedUser.id == this.myUser.id) {
                this.myUser.email = email
              }
                
            }),
            catchError(err => {
              // console.log('err : ', err);
              if (!err.status) {
                err = 'serveur non accessible'  
            } else if (err.status == 500) {
                err = 'erreur interne serveur' 
            } else if (err.status == 404) {
                err = 'non trouvé'   
            } else {
                err = err.error.message
            } 
              throw err;
            })
          ) 
  }
/** met à jour le password via l'API
 *  @param editedUser : user "étendu" en cours d'édition
 *  @param oldPassword : ancien password qui sera vérifié avant modification 
 *  @param password : nouveau password
 */
  updatepasswordUser(editedUser:UserExtended, oldPassword:string, password:string): Observable<User> {
    let body = {oldPassword, password};
    return this.http.patch(this.usersUrl+editedUser.id+'/password', body, this.httpOptions)
          .pipe(
            tap((data: any) => {
              // console.log('données patch user password  : ', data)
            }),
            catchError(err => {
              // console.log('err : ', err);
              if (!err.status) {
                err = 'serveur non accessible'  
            } else if (err.status == 500) {
                err = 'erreur interne serveur' 
            } else if (err.status == 401) {
                err = 'ancien mot de passe erroné'  
            } else if (err.status == 404) {
                err = 'non trouvé'   
            } else {
                err = err.error.message
            } 
              throw err;
            })
          ) 
  }

/** met à jour le cache avec le user fourni
 */ 
  putUserInCache(data:any) : void {
    // on renseigne le nom à afficher avec nom, prénom si disponibles, sinon on met par défaut le numéro d'utilisateur
    let fullName = this.formatFullName(data.id, data.lastname, data.firstname)

    let newUserExtendedCache = {...data, fullName:fullName};
    let avatarUrl = data.avatarUrl ? data.avatarUrl : this.defaultAvatarUrl; 
    newUserExtendedCache.avatarUrl = avatarUrl;
    if (newUserExtendedCache.role) {
      delete newUserExtendedCache.role
    };
    this.UsersExtendedCache = this.UsersExtendedCache!.filter(u => u.id !== data.id);
    this.UsersExtendedCache.push(newUserExtendedCache);
    // console.log('this.UsersExtendedCache : ', this.UsersExtendedCache);
  }

/** met à jour l'ensemble du cache avec les users fournis
 */ 
  putAllUsersInCache(users:User[]) :void {
    // on supprime le cache car on va le réactualiser en globalité
    this.UsersExtendedCache = [];
    for (let user of users) {
      let fullName = this.formatFullName(user.id, user.lastname, user.firstname)
      let newUserExt = {...user, fullName:fullName}
      newUserExt.avatarUrl = user.avatarUrl ? user.avatarUrl : this.defaultAvatarUrl;
      console.log('newUsertExt : ', newUserExt)
      this.UsersExtendedCache.push(newUserExt);
    } 
    this.UsersExtendedCacheFullyCharged = true;
  } 


/** formate le fullName pour l'affichage à partir des données disponibles. sans données ce sera le Untilisateur N° ...
 *  @param userId -  id du user 
 *  @param lastname -  lastname 
 *  @param userId -  firstname 
 *  @retuns fullName -  fullName prêt pour l'affichage
 */   
  formatFullName(userId:number, lastname:string, firstname:string) : string {
    let fullName =('utilisateur n° ' + userId)
    if (lastname && firstname)
      fullName = (firstname + ' '+ lastname)
    else if (lastname)
      fullName = lastname
    else if(firstname)
      fullName = firstname;
    return fullName
  }

/** supprime les données en mémoire temporaire pour l'utilisateur actuel
 */ 
  eraseMyUserData() : void {
    this.myUser =  {id:0,email:'', lastname:'',firstname:'',fonction:'',avatarUrl:'', role:0, createdTime:'',modifiedTime:''}
  }
}



import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User, UserExtended } from '../models/user.model';
import {Router} from '@angular/router';

// ICIJCO à mettre en import/param
const baseUrl = 'http://localhost:3000/api/v1/'

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usersUrl = baseUrl+'users/';
  private postsUrl = baseUrl+'posts';
  public UsersExtendedCache: UserExtended[] =[]
  public myUser:User = {id:0,email:'', lastname:'',firstname:'',fonction:'',avatarUrl:'', role:0, createdTime:'',modifiedTime:''}
  public UsersExtendedCacheFullyCharged = false;
  defaultAvatarUrl ='assets/logo-avatar.jpg' 
  avatarUrl ='';    

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(
    private http: HttpClient,
    private router: Router,
    ) { }

  

  getOneUser(userId:number): Observable<User> {
      return this.http.get<User>(this.usersUrl+userId)
          .pipe(
            tap((data: any) => {
              console.log('données reçues : ', data)
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

  // getMyUserData()  {
  //   // let avatarUrl='';
  //   if (this.myUserdata.id && (this.myUserdata.id !=0 ) ) {
  //       return this.myUserdata
  //   } else {
  //       this.getMyUser()
  //             .subscribe ( {
  //               next : (data) => {
  //                 console.log('données getMyUser reçues : ', data)
  //                 // if (data.avatarUrl)
  //                   // avatarUrl = data.avatarUrl;

  //                 // if (data.lastname && data.firstname)
  //                 //   this.fullName = (data.firstname + ' '+ data.lastname)
  //                 // else if (data.lastname)
  //                 //   this.fullName = data.lastname
  //                 // else if(data.firstname)
  //                 //   this.fullName = data.firstname;
  //                 // let newUserExtendedCache = {...data, fullName:this.fullName};
  //                 // newUserExtendedCache.avatarUrl = avatarUrl;
  //                 // this.UsersExtendedCache = this.UsersExtendedCache!.filter(u => u.id !== data.id)
  //                 // this.UsersExtendedCache.push(newUserExtendedCache)
  //                 this.myUserdata = data
  //                 return this.myUserdata

  //               },
  //               error: (err) => {
  //                 this.router.navigateByUrl('/auth/login')
  //                 return this.myUserdata
  //               },
  //               complete: () => {
  //                 return this.myUserdata
  //               }
  //             })
               
  //   }

  getAllUsers() : Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl)
          .pipe(
            tap((data: any) => {
              console.log('données reçues : ', data)
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
    
  deleteUser (userId:number): Observable<User> {
    return this.http.delete<User>(this.usersUrl+userId)
        .pipe(
          tap((data: any) => {
            console.log('données deletePost  : ', data)
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


  // }
  putUserInCache(data:any) : void {
    // on renseigne le nom à afficher avec nom, prénom si disponibles, sinon on met par défaut le numéro d'utilisateur
    let fullName = this.formatFullName(data.id, data.lastname, data.firstname)
    // let fullName =('utilisateur n° ' + data.id)
    // if (data.lastname && data.firstname)
    //   fullName = (data.firstname + ' '+ data.lastname)
    // else if (data.lastname)
    //   fullName = data.lastname
    // else if(data.firstname)
    //   fullName = data.firstname;
    

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

  putAllUsersInCache(users:User[]) {
    // on supprime le cache car on va le réactualiser en globalité
    this.UsersExtendedCache = [];
    for (let user of users) {
      //ICIJCO: penser à refactorer le code des autres endroits où on gère le fullname
      let fullName = this.formatFullName(user.id, user.lastname, user.firstname)
      let newUserExt = {...user, fullName:fullName}
      newUserExt.avatarUrl = user.avatarUrl ? user.avatarUrl : this.defaultAvatarUrl;
      console.log('newUsertExt : ', newUserExt)
      this.UsersExtendedCache.push(newUserExt);
    } 
    this.UsersExtendedCacheFullyCharged = true;
  } 



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


  eraseMyUserData() : void {
    this.myUser =  {id:0,email:'', lastname:'',firstname:'',fonction:'',avatarUrl:'', role:0, createdTime:'',modifiedTime:''}
  }
}



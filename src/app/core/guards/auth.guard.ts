//  <---------------------- gard utilisé dans les modules de routing pour vérifier le token  ------------->
//  <---------------------- si token ko, on redirige vers la "page" login                    ------------->

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { TokenService } from 'src/app/core/services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private tokenService: TokenService,
              private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.tokenService.isTokenValid()) {
        return true;
    } else {
        console.log('token absent ou expiré')
        this.router.navigateByUrl('/auth/login');
        return false;
    }
  }
}
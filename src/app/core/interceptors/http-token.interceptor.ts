//  <-------------------   Intercepteur des requetes http en sorties pour ajouter le Bearer / token    ------------>

import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from 'src/app/core/services/token.service';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  constructor(
    private tokenService: TokenService,
  ) {}


  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const headers = new HttpHeaders()
      .append('Authorization', `Bearer ${this.tokenService.getToken()}`);
    const modifiedRequest = request.clone({ headers });
    
    return next.handle(modifiedRequest);
  }
}

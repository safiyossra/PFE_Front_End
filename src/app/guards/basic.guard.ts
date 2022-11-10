import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticateService } from '../services/authenticate.service';

@Injectable({
  providedIn: 'root'
})
export class BasicGuard implements CanActivate {
  constructor(private router: Router, private authenticateService: AuthenticateService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      // console.log("Route = ",route);
      
    let JWT = localStorage.getItem('JWT')
    if (JWT) {
      return new Observable<boolean>((observer) => {
        this.authenticateService.isLoggedIn(JWT).toPromise().then((e) => {
          observer.next(true);
          observer.complete();
          // console.log('authenticated');
        }).catch(error => {
          console.log('catch not authenticated', error);
          this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
          observer.next(false);
          observer.complete();
        })
      })
    } else {
      this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}

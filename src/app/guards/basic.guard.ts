import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BasicGuard implements CanActivate {
  constructor(private router: Router) { }

  JWT: string;
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.JWT = localStorage.getItem('JWT')
    if (this.JWT) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}

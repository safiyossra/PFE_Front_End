import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { util } from '../tools/utils';

@Injectable({
  providedIn: 'root'
})
export class PermissionsGuard implements CanActivate {
  constructor(private tools :util) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let can = this.tools.isAuthorized(route.data.permissionKey??'Map_Vehicules','Afficher')
    // console.log("route.data.permissionKey",route.data.permissionKey??'Map_Vehicules',can);
    if (can) {
      return true;
    } else {
      return false;
    }
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from "@angular/router";
import { Observable } from 'rxjs';
import PNotify from 'pnotify/dist/es/PNotify';
import { UserService } from './user.service';
PNotify.defaults.icons = 'fontawesome4';

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {

  constructor(private _authService: UserService, private _router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this._authService.authenticated) {
      return true;
    } else {
      this._router.navigate(["/home"])
      PNotify.error({
        text: `Please sign in to access this page.`
      });
      return false;
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }

}

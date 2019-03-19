// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from "@angular/router";
// import PNotify from 'pnotify/dist/es/PNotify';
// import { UserService } from './user.service';
// PNotify.defaults.icons = 'fontawesome4';

// @Injectable()
// export class AuthGuardService implements CanActivate, CanActivateChild {

//   constructor(private _router: Router, private _auth: UserService) { }

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): boolean {
//     let url: string = state.url;

//     return this.checkLogin(url);
//   }

//   canActivateChild(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): boolean {
//     return this.canActivate(route, state);
//   }

//   checkLogin(url: string): boolean {
//     if (this._auth.isLoggedIn) { return true; }

//     // Store the attempted URL forsign-in redirecting
//     this._auth.redirectUrl = url;

//     // Navigate to the login page with extras
//     this._router.navigate(['/sign-in']);
//     return false;
//   }

// }

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

    if (this._authService.isLoggedIn) {
      return true;
    } else {
      this._router.navigate(["/sign-in"])
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


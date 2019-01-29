import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {RouteGuardService} from './route-guard.service'
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class LoginActivateGuard implements CanActivate {
  constructor(private guard: RouteGuardService,
    private route: Router){}
    canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if(this.guard.isLoggedIn) {
          return true;
        }
        return this.guard.getIsLoggedIn().pipe(

          map(res => {
            console.log("MAP DATA")
            console.log(res);
            if(res.status){
              this.guard.setIsLoggedIn(true);
              console.log("this is inside login activate guard",this.guard.isLoggedIn);
              return true;
            }
            else {
              console.log(res.status);
              console.log("this is else part if response is false")
              this.route.navigateByUrl('/login');
              return false;
            }
          })
        )
      }
    }

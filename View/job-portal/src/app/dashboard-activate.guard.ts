import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RouteGuardService } from './route-guard.service';
import { map } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class DashboardActivateGuard implements CanActivate {
  constructor(private route:Router,
    private guard:RouteGuardService){}
    canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if(this.guard.isLoggedIn)
        { this.route.navigateByUrl('/dashboard');
        return false;
      }
      return this.guard.getIsLoggedIn().pipe(
        map(res => {
          console.log("MAP DATA")
          console.log(res);
          if(res.status){
            this.guard.setIsLoggedIn(true);
            console.log("this is inside dashboard activate guard",this.guard.isLoggedIn);
            console.log(res.username)
            var ciphertext = CryptoJS.AES.encrypt(res.username, 'secret key 123');
            var newCipher = ciphertext.toString().replace(/\+/g,'THISISPLUS').replace(/\//g,'THISISSLASH').replace(/\=/g,'THISISEQUALTO');
            this.route.navigateByUrl(`/dashboard/${newCipher}`);
            return false;
          }
          else {
            console.log(res.status);
            console.log("this is else part if response is false")
            //
            return true;
          }
        })
      )

    }
  }

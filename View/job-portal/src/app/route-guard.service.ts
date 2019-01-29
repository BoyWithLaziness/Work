import { Injectable } from '@angular/core';
import { HttpHanderService } from './http-hander.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {
  isLoggedIn = false;
  constructor(private http: HttpHanderService) { }

  getIsLoggedIn(){
    return this.http.get('job_portal/check_login')
  }

  setIsLoggedIn(value){
    this.isLoggedIn = value;
  }

  logout(){
    console.log("this is the route guard service")
    return this.http.get('job_portal/user_logout')


  }


}

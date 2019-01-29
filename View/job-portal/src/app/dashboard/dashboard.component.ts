import { Component, OnInit} from '@angular/core';
import {RouteGuardService} from '../route-guard.service'
import { map, catchError } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpHanderService } from '../http-hander.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  baseUrl = environment.baseUrl;
  srcData : SafeResourceUrl;
  fileNameArray: any[]=[];
  path: SafeResourceUrl;
  fileName:string;
  dataObject: UserObject;
  username:string;

  constructor(
    private guard: RouteGuardService,
    private router: Router,
    private route:ActivatedRoute,
    private http: HttpHanderService,
    private sanitizer: DomSanitizer) {  }

    ngOnInit() {
      this.route.params.subscribe(params => { this.username = params['username']; });
      var str2 = this.username.toString().replace(/THISISPLUS/g,'+').replace(/THISISSLASH/g,'/').replace(/THISISEQUALTO/g,'=');
      console.log(str2)
      var name =  CryptoJS.AES.decrypt(str2.toString(), 'secret key 123');
      var plaintext = name.toString(CryptoJS.enc.Utf8);
      console.log("this is name")
      console.log(plaintext)
      this.http.post('job_portal/get_user',{username:plaintext}).subscribe(data=>{
        console.log("this is data in dashboard")
        this.dataObject = new UserObject();
        this.dataObject = data[0];
        this.fileName  = this.dataObject.ProfilePicture.split('/')[2];
        this.path = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.baseUrl}/uploads/${this.fileName}`);
        console.log(this.dataObject)
      });
      this.http.get('job_portal/get_photos')
      .subscribe(data =>{

        for(var i=0;i<data.filesArray.length;i++) {
          console.log(data.filesArray[i])
          this.srcData = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.baseUrl}/uploads/${data.filesArray[i]}`);
          this.fileNameArray[i]=this.srcData;
        }
        console.log(this.fileNameArray);
      });

    }

    logout(){
      this.guard.setIsLoggedIn(false);
      this.guard.logout()
      .subscribe(res=>{
        console.log(res)
      }
    );
    this.router.navigateByUrl('/home')
  }

}

class UserObject{
  Address: string;
  BirthDate:string;
  City:string;
  Email:string;
  FirstName: string;
  Gender: string;
  Hobbies:string[];
  LastName: string;
  Password: string;
  PhoneNo: string;
  ProfilePicture: string;
  State: string;
  Username: string;
  Zipcode: string;
  __v: number;
  _id: string;
}

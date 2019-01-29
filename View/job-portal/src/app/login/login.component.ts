import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { HttpHanderService } from '../http-hander.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { RouteGuardService } from '../route-guard.service';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(
    private fb:FormBuilder,
    private http:HttpHanderService,
    private router:Router,
    private toastr: ToastrService,
    private guard:RouteGuardService) { }

    ngOnInit() {

      this.loginForm = this.fb.group({
        userName : ['',Validators.required],
        password : ['',Validators.required]
      });


    }

    get userName(){
      return this.loginForm.get('userName');
    }

    get password(){
      return this.loginForm.get('password');
    }


    checkCredentials(username,password):void {
      var data = {
        username:username,
        password:password
      }
      console.log("this is inside login component ts",data);
      this.http.post('job_portal/login/',data)
      .subscribe(value  => {
        if(value.truthValue) {

          this.guard.isLoggedIn = true;

          console.log('this.guard.isLoggedIn = ',this.guard.isLoggedIn)
          console.log("this is data.username")
          console.log(data.username);


          var ciphertext = CryptoJS.AES.encrypt(data.username, 'secret key 123');
          var newCipher = ciphertext.toString().replace(/\+/g,'THISISPLUS').replace(/\//g,'THISISSLASH').replace(/\=/g,'THISISEQUALTO');
          console.log(newCipher);

          this.toastr.success('Login', 'You are Logged in.');
          this.router.navigateByUrl(`/dashboard/${newCipher}` );
        }

        else {
          this.toastr.warning('(ಠ_ಠ)', 'Sorry, wrong credentials');
        }
      });
    }

    clickForgotPassword():void {
      this.toastr.info('(͡ ͡° ͜ つ ͡͡°)', 'Shame on you');
    }

  }

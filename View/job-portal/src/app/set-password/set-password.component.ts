import { Component, OnInit } from '@angular/core';
import {FormGroup,FormBuilder,Validators} from '@angular/forms';
import { environment } from 'src/environments/environment';
import {passwordValidator} from '../password.validator'
import { HttpHanderService } from '../http-hander.service';
import { Router, ActivatedRoute } from '@angular/router';

import * as CryptoJS from 'crypto-js';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css']
})
export class SetPasswordComponent implements OnInit {
  pattern = /^[A-z](?=.*[A-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-{}\\|[\];':",.<>/?`~]).{4,8}/;
  regex =  RegExp(this.pattern);
  secretKey: string = environment.secretKey;
  setPasswordForm: FormGroup;
  emailID:string;
  splitted:string[];
  isUpdated:boolean;
  constructor(private fb:FormBuilder,
    private router: Router,
    private http:HttpHanderService,
    private route: ActivatedRoute,
    private toastr: ToastrService) { }

    ngOnInit() {
      this.setPasswordForm = this.fb.group({
        password : ['',    [    Validators.required,
          Validators.minLength(4),
          Validators.maxLength(8),
          Validators.pattern(this.regex),
        ]
      ],
      passwordAgain : ['',[   Validators.required,
        Validators.minLength(4),
        Validators.maxLength(8),
        //Almost correct string
        //^(.+[A-z].+)([0-9]+)([.*!@#$%^&*(),.?":{}|<>]+)$
        Validators.pattern(this.regex),
      ]
    ]
  },{validator:passwordValidator});

  this.route.params.subscribe(params => { this.emailID = params['email']; });
  var str = this.router.url.split("/",4)
  console.log(this.emailID);
  console.log(str);
}

get password(){
  return this.setPasswordForm.get('password');
}
get passwordAgain(){
  return this.setPasswordForm.get('passwordAgain');
}

changePassword(password): void {
  if(this.password.valid) {
    var data = {
      email:this.emailID,
      newpassword:password
    }
    this.http.post('job_portal/set_password',data)
    .subscribe((value:any) =>{
      if(value.truthValue){
        this.toastr.success('Set Password', 'Password changed successfully');
        this.isUpdated = value.truthValue;
        this.router.navigateByUrl('/home')
      }
      else {
        this.toastr.warning('Problem', 'Password not chnaged');
      }
    })

  }

}

}

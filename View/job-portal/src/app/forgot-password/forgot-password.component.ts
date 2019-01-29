import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpHanderService } from '../http-hander.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  uniqueEmailTruthValue:boolean
  checkEmail:string;
  emailStatus:boolean;
  forgotPasswordForm: FormGroup;

  constructor(
    private http:HttpHanderService,
    private fb:FormBuilder,
    private router:Router,
    private toastr: ToastrService) { }

    ngOnInit() {
      this.forgotPasswordForm = this.fb.group({
        email:['',[Validators.required,Validators.email]]
      });

      this.email.valueChanges.subscribe(value=> {
        this.checkEmail =  value;
        this.checkEmailUnique(this.checkEmail);
      })

    }

    get email(){
      return this.forgotPasswordForm.get('email');
    }

    checkEmailUnique(email):void {
      console.log("inside checkEmailUnique");
      var data ={
        email:email,
        username:""
      }
      this.http.post('job_portal/is_unique',data)
      .subscribe(value=> {
        this.uniqueEmailTruthValue = value.truthValue;
        console.log("Boolean Value return is "+value.truthValue);
      });
    }

    sendEmail(email):void {
      if(this.uniqueEmailTruthValue === true) {
        var data = {
          email:email
        }
        this.http.post('job_portal/send_mail',data)
        .subscribe(value=> {
          this.emailStatus = value.truthValue;
          console.log("Boolean Value return is "+this.emailStatus);
          this.callToaster(value.truthValue);
        });


      }


    }

    callToaster(value): void{
      if(value) {
        this.toastr.success('Link Sent', 'Check your email');
      }
      else {
        this.toastr.warning('Problem', 'Link not sent');
      }

    }
  }

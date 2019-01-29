import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Http,Response} from '@angular/http';

import { passwordValidator } from '../password.validator'
import { HttpHanderService } from '../http-hander.service';
import { States } from '../States';
import { DatePipe } from '@angular/common';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  [x: string]: any;
  States: States[] = [];
  registerForm: FormGroup;
  checkEmail: string;
  checkUsername: string;
  uniqueEmailTruthValue: boolean;
  uniqueUsernameTruthValue: boolean;
  file: File;
  fd = new FormData();
  image_size: boolean;
  image_type:boolean;
  pattern = /^[A-z](?=.*[A-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-{}\\|[\];':",.<>/?`~]).{4,8}/;
  regex =  RegExp(this.pattern);
  newPath:string;






  constructor(
    private fb: FormBuilder,
    private http: HttpHanderService,
    public datepipe: DatePipe,
    private route:Router,
    private toastr: ToastrService) { }

    ngOnInit() {

      this.registerForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        birthDate: ['', Validators.required],
        gender: ['', Validators.required],
        hobbies: this.fb.group({
          Cricket: ['',],
          Dancing: ['',],
          Singing: ['',],
          Acting: ['',],
        }),
        phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        address: [''],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
        email: ['', [Validators.required, Validators.email]],
        userName: ['', Validators.required],
        password: ['', [Validators.required,
          Validators.pattern(this.regex),
          Validators.minLength(4),
          Validators.maxLength(8)
        ]
      ],
      passwordAgain: ['', [Validators.required,
        Validators.pattern(this.regex),
        Validators.minLength(4),
        Validators.maxLength(8)
      ]
    ],
    profilePicture: ['', Validators.required]

  }, { validator: passwordValidator });

  this.getStates();

  this.email.valueChanges.subscribe(value => {
    this.checkEmail = value;
    this.checkEmailUnique(this.checkEmail);
  })

  this.userName.valueChanges.subscribe(value => {
    this.checkUsername = value;
    this.checkUsernameUnique(this.checkUsername);
  })
}

//Getters for form controls of registerForm(FormGroup)
get firstName() {
return this.registerForm.get('firstName');
}
get lastName() {
  return this.registerForm.get('lastName');
}
get birthDate() {
  return this.registerForm.get('birthDate');
}
get gender() {
  return this.registerForm.get('gender');
}
get hobbies() {
  return this.registerForm.get('hobbies');
}

get Cricket() {
  return this.registerForm.get('hobbies').get('Cricket');
}
get Dancing() {
  return this.registerForm.get('hobbies').get('Dancing');
}
get Singing() {
  return this.registerForm.get('hobbies').get('Singing');
}
get Acting() {
  return this.registerForm.get('hobbies').get('Acting');
}

get phoneNumber() {
  return this.registerForm.get('phoneNumber');
}
get address() {
  return this.registerForm.get('address');
}
get city() {
  return this.registerForm.get('city');
}
get state() {
  return this.registerForm.get('state');
}
get zipCode() {
  return this.registerForm.get('zipCode');
}
get email() {
  return this.registerForm.get('email');
}

get userName() {
  return this.registerForm.get('userName');
}

get password() {
  return this.registerForm.get('password');
}
get passwordAgain() {
  return this.registerForm.get('passwordAgain');
}
get profilePicture() {
  return this.registerForm.get('profilePicture');
}

addData(): void {
  if(this.registerForm.valid && this.image_size && this.image_type) {
    //console.log(this.registerForm.value);
    //console.log(this.state);
    var newFormData = this.formatData(this.registerForm.value);
    //console.log("this is the new data");
    //console.log(newFormData);
    //console.log("this is new Form data before adding data ")
    //console.log(newFormData.Image)
    this.fd.append('file',this.file);
    this.fd.append('username',newFormData.Username)
    var headers = new Headers();
    headers.append("Content-Type", 'multipart/form-data');
    headers.append('Access-Control-Allow-Origin', '*');

    this.http.post2('job_portal/upload/', this.fd,headers)
    .subscribe(status => {
      this.newPath = status.path;
      console.log("THIS IS RESPONSE BACK FROM UPLOAD  ",status)
    });
    newFormData.ProfilePicture = this.newPath;
    this.http.post('job_portal/create_user/', newFormData)
    .subscribe(status => {
      console.log("THIS IS RESPONSE BACK FROM CREATE USER",status)
      this.fd.delete('username');
      this.fd.delete('file');
    });

    this.toastr.success('Registered', 'You are added to our DB');
    this.route.navigateByUrl('/home')
  }


}


checkEmailUnique(email): void {
  //console.log("inside checkEmailUnique");
  var data = {
  email: email,
  username: ""
}
this.http.post('job_portal/is_unique/', data)
.subscribe(value => {
  this.uniqueEmailTruthValue = value.truthValue;
  //console.log("Boolean Value return is " + value);
});
}

checkUsernameUnique(username): void {
  var data = {
    email: "",
    username: username
  }
  //.log("inside checkUsernameUnique");
  this.http.post('job_portal/is_unique/', data)
  .subscribe(value => {
    this.uniqueUsernameTruthValue = value.truthValue;
    //console.log("Boolean Value return is " + value);
  });
}

getStates(): void {
  this.http.get('job_portal/show_states').subscribe((data: any) => {
    this.States = data;
    //console.log(this.States);
  });
}

formatData(data): any {
  var hobby = [];
  if (data.hobbies.Cricket == true) { hobby.push('Cricket') }
  if (data.hobbies.Dancing == true) { hobby.push('Dancing') }
  if (data.hobbies.Singing == true) { hobby.push('Singing') }
  if (data.hobbies.Acting == true) { hobby.push('Acting') }
  //console.log(data.birthDate);
  //console.log(this.datepipe.transform(data.birthDate, 'MM-dd-yyyy'));
  //var picture = data.profilePicture.replace("C:\\fakepath\\", "");

  //console.log("this is fd", this.fd)
  return {
  FirstName: data.firstName,
  LastName: data.lastName,
  BirthDate: this.datepipe.transform(data.birthDate, 'MM-dd-yyyy'),
  Gender: data.gender,
  Hobbies: hobby,
  PhoneNo: data.phoneNumber,
  Address: data.address,
  City: data.city,
  State: data.state,
  Zipcode: data.zipCode,
  Email: data.email,
  Username: data.userName,
  Password: data.password,
  ProfilePicture: data.profilePicture,
  Image: this.fd
}

}


onFileChange(event) {

  this.file = <File> event.target.files[0];
  //console.log(this.file);
  //console.log(this.fd);
  if (event.target.files && event.target.files.length) {
  this.file = <File> event.target.files[0];
  var img_data = {
    size : this.file.size,
    type : this.file.type,
    name: this.file.name
  }
  this.http.post('job_portal/image_criteria_check/',img_data)
  .subscribe((res:any)=>{
    //console.log(res);
    this.image_size = res.size;
    this.image_type = res.type;
  });
}

}


onCheckboxChange(event, value) {
  //console.log(value)
  // console.log("you change checkbox value");
  //console.log(event);
  // console.log(this.registerForm.get('hobbies').value);
  // console.log(value)
  // console.log("this the value of check");
  // console.log(" checkCricketValue ="+this.Cricket.value);
  // console.log(" checkDancingValue ="+this.Dancing.value);
  // console.log(" checkSingingValue ="+this.Singing.value);
  // console.log(" checkActingValue ="+this.Acting.value);
  //  if (this.registerForm.get('hobbies').value) {
  //    this.hobbiesArray.push(value);
  //    console.log("this is after the push")
  //    console.log(this.hobbiesArray)
  //  }
  //  if (!this.registerForm.get('hobbies').value) {
  //    let index = this.hobbiesArray.indexOf(value);
  //    if (index > -1) {
  //      this.hobbiesArray.splice(index, 1);
  //      console.log("this is after the splice")
  //      console.log(this.hobbiesArray)
  //    }
  //  }
}

}

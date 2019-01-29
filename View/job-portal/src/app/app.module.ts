import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import {Http,Response} from '@angular/http';
import {NgxMaskModule} from 'ngx-mask';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';

import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';


import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


import {LoginActivateGuard} from './login-activate.guard';
import {RouteGuardService} from './route-guard.service';
import { DashboardActivateGuard } from './dashboard-activate.guard';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { DatePipe } from '@angular/common';
import { ProblemComponent } from './problem/problem.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ForgotPasswordComponent,
    SetPasswordComponent,
    ProblemComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
    timeOut: 10000,
    positionClass: 'toast-top-right',
    preventDuplicates: true,
  }),
    BsDatepickerModule.forRoot(),
    NgxMaskModule.forRoot(),
    AppRoutingModule
  ],
  providers: [DatePipe,
              RouteGuardService,
              LoginActivateGuard,
              DashboardActivateGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }

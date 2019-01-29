import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { ProblemComponent } from './problem/problem.component';
import {LoginActivateGuard} from './login-activate.guard';
import {RouteGuardService} from './route-guard.service';
import { DashboardActivateGuard } from './dashboard-activate.guard';

const routes: Routes = [
                        {path: '', redirectTo: '/home', pathMatch: 'full' },
                        {path:'home',component:HomeComponent},
                        {path:'login',component:LoginComponent,canActivate:[DashboardActivateGuard]},
                        {path:'register',component:RegisterComponent},
                        {path:'dashboard/:username',component:DashboardComponent, canActivate:[LoginActivateGuard]},
                        {path:'forgot-password',component:ForgotPasswordComponent},
                        {path:'set-password/:email',component:SetPasswordComponent},
                        {path:'**',component:ProblemComponent}
                       ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

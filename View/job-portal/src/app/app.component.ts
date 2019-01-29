import { Component, OnInit } from '@angular/core';
import { RouteGuardService } from './route-guard.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private guard: RouteGuardService,
              private router:Router){}
  ngOnInit(): void {
    }

  title = 'job-portal';
}

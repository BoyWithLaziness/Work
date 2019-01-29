import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.css']
})
export class ProblemComponent implements OnInit {

  constructor(private router:Router,
              private toastr:ToastrService) { }

    ngOnInit() {
      var str = this.router.url.split("/",3)
      this.toastr.warning('Problem', 'Some problem occured');
      console.log(str);
    }

    gotoLogin():void {
      this.router.navigateByUrl('/login')
    }

  }

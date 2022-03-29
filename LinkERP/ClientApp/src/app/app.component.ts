import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute) {
  
    try {
      const str = window.location.href;
      if (str.includes('reset-password')) { 
        let str3 = '/reset-password/';
        let domainLength = str.indexOf('/reset-password/', 0);
        this.ResetPasswordCode = str.substr(domainLength + str3.length, str.length);
        // alert(this.ResetPasswordCode);
      }
    } catch (err) {

    };

    if (localStorage.length == 0) {
      var url = window.location.href;
      let CurrentUrl = window.location.pathname;
      this.router.navigate(['/login']);
    }
    var url = window.location.href;
    let currentUrl = window.location.pathname;
    if (currentUrl == '/login') {
      this.router.navigate(['/home']);
    }
    else if (url[url.length - 1] != '/') {
      this.router.navigate([currentUrl]);
    }

    else {
      this.router.navigate(['/home']);
    }
  }
  ResetPasswordCode: any;
  ngOnInit(): void {
    try {
      //const code = this.activatedRoute.snapshot.params['id'];
      const str = window.location.href;
      if (str.includes('reset-password')) {
        //let str2 = "http://localhost:56530/reset-password/"
        //const str2="http://localhost:56530/reset-password/QWRtaW58QWRtaW58My8xMS8yMDIwIDg6MjU6MTYgUE0%3d"
        // alert(str2.length);
        let str3 = '/reset-password/';
        // alert(str3.length);
        let domainLength = str.indexOf('/reset-password/', 0);
        this.ResetPasswordCode = str.substr(domainLength + str3.length, str.length);
        alert(this.ResetPasswordCode);
        //alert(str.substr(domainLength + str3.length, str.length));
        // alert(str.indexOf('/reset-password/', 0));
        // alert(str.indexOf('password/', 0));
        //alert(window.location.href);
        //alert(window.location.href);
      }
    } catch (err) {

    };
  }
}

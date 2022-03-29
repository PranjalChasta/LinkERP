import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators'
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class AppInterceptorService implements HttpInterceptor {

  constructor(private router: Router,
    private toastr: ToastrService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('Token')
    });

    //console.log('Token : '+ localStorage.getItem('Token'));
    if (localStorage.getItem('CompanyID') != null) {
      headers = headers.append('CompanyID', localStorage.getItem('CompanyID'));
    }
    if (localStorage.getItem('LoginID') != null) {
      headers = headers.append('LoginID', localStorage.getItem('LoginID'));
    }
    const clone = req.clone({
      headers: headers
    });
    return next.handle(clone)
      .pipe(
        catchError(this.handleError)
      );
  }
  handleError(error: HttpErrorResponse) {

    if (error.status == 401) {
      alert('Unauthorized Access');
      this.toastr.error('Unauthorized Access');
    }
    else {
      alert('Server Error');
      //console.log(error.message);
      this.toastr.error('Server Error');
    }
    return throwError(error);
  }

}

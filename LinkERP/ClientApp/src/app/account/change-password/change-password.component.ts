import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { ChangePassword } from '../../models/account/change-password/change-password';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  Loading: any = false;
  Alert: any = '';
  ChangePasswordForm: FormGroup;
  ResetCode: any;
  LoginID: any;
  UserName: any;

  ErrorMessage: any;

  Submitted = false;


  constructor(private FB: FormBuilder,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private router: Router,

    private toastr: ToastrService) { }

  ngOnInit() {

    this.ChangePasswordForm = this.FB.group({
      CurrentPassword: ['', Validators.required],
      NewPassword: ['', Validators.required],
      ConfirmNewPassword: ['', Validators.required]
    });
  }
  get f() { return this.ChangePasswordForm.controls; }
  OnChangePassword() {
    this.Submitted = true;
    if (this.ChangePasswordForm.invalid) {
      return;
    }

    let changePassword: any = new ChangePassword();

    changePassword.LoginID = sessionStorage.getItem('LoginID');
    changePassword.OldPassword = this.ChangePasswordForm.get('CurrentPassword').value;
    changePassword.NewPassword = this.ChangePasswordForm.get('ConfirmNewPassword').value;

    this.accountService.changePassword(changePassword).subscribe((resp: any) => {
      if (resp.data == true) {
        this.Alert = 'Success';
      }
      else {
        this.Alert = 'Error';
      }
    }, (error) => {

    });

  }
  Relogin() {
    this.router.navigate(['/login']);
  }

}

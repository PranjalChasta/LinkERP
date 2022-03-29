import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { ResetPassword } from '../../models/account/reset-password/reset-password';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmEqualValidatorDirective } from '../../shared/directives/confirm-equal-validator.directive';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  @Input() ResetPasswordCode: any = '';

  Loading: any = false;
  Alert: any = '';
  ResetPasswordForm: FormGroup;
  ResetCode: any;
  LoginID: any;
  UserName: any;
  IsResetPasswordExpired: boolean = true;
  ErrorMessage: any;
  Submitted = false;
  Message = '';
  constructor(private FB: FormBuilder,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private router: Router,

    private toastr: ToastrService) { }

  ngOnInit() {

    if (sessionStorage.getItem('ResetPasswordCode') != null) {
      this.ResetPasswordCode = sessionStorage.getItem('ResetPasswordCode');
    }
    // const code = this.activatedRoute.snapshot.params['id'];
    // this.ResetCode = code;
    // alert(this.ResetCode);
    // alert('Reset Password Code: ' + this.ResetPasswordCode);
    debugger;
    if (this.ResetPasswordCode != '') {
      try {
        // const IdDecoded = atob(this.ResetPasswordCode);
        // const strArr = IdDecoded.split("|");

        // this.LoginID = strArr[0];
        // this.UserName = strArr[1];
        let CodeData: any = {
          Code: this.ResetPasswordCode
        }
        this.accountService.IsResetPasswordExpired(CodeData).subscribe((resp: any) => {

          if (resp.data == true) {
            this.IsResetPasswordExpired = true;
          }
          else {
            this.IsResetPasswordExpired = false;
          }
        }, (error) => {
          console.log("Error in service :" + error.message);
        });

      } catch (error) {
        this.IsResetPasswordExpired = true;
        this.ErrorMessage = "Password reset link is invalid or expired";
        this.toastr.error(this.ErrorMessage);
      }
    }

    this.ResetPasswordForm = this.FB.group({
      NewPassword: ['', Validators.required],
      ConfirmNewPassword: ['', Validators.required]
    });
  }
  get f() { return this.ResetPasswordForm.controls; }
  IsReset = false;

  OnResetPassword() {

    this.Submitted = true;
    if (this.ResetPasswordForm.invalid) {
      return;
    }

    // if (this.ResetPasswordForm.get('NewPassword').value != this.ResetPasswordForm.get('ConfirmNewPassword').value) {
    //   this.Message = 'Confirm password not matching';
    //   this.Alert = 'Error';

    //   return;
    // }
    this.Message = '';
    this.Alert = '';
    this.Loading = true;
    let resetPassword: any = new ResetPassword();

    resetPassword.ResetCode = this.ResetPasswordCode;
    resetPassword.Password = this.ResetPasswordForm.get('NewPassword').value;

    this.accountService.resetPassword(resetPassword).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        this.Alert = 'Success';
      }
      else {
        this.Alert = 'Error';
      }
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
    });
  }
  Relogin() {
    this.router.navigate(['/login']);
  }

}

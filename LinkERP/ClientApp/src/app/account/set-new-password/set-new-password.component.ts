import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';
import { LbsSysUser } from '../../models/sys/lbs-sys-user';
import { CustomValidators } from 'ngx-custom-validators';


@Component({
  selector: 'app-set-new-password',
  templateUrl: './set-new-password.component.html',
  styleUrls: ['./set-new-password.component.css']
})
export class SetNewPasswordComponent implements OnInit {

  LoginID: any;
  SetNewPasswordForm: FormGroup;
  Submitted = false;
  constructor(private FB: FormBuilder,
    private router: Router,
    private accountService: AccountService) { }

  ngOnInit() {

    if (sessionStorage.getItem('LoginID') == null && sessionStorage.getItem('Token') == null) {
      this.router.navigate(['/login']);
    }


    this.CreateSetNewPasswordForm();
  }
  get f() { return this.SetNewPasswordForm.controls; }
  CreateSetNewPasswordForm() {
    this.SetNewPasswordForm = this.FB.group({
      NewPassword: ['', [Validators.required]],
      ConfirmNewPassword: ['', [Validators.required]],
      SecurityQuestion: ['-1', CustomValidators.notEqual('-1')],
      SecurityAnswer: ['', [Validators.required]]
    });
  }

  SetNewPassword() {

    this.Submitted = true;
    if (this.SetNewPasswordForm.invalid) {
      return;
    }

    let User: any = new LbsSysUser()
    User.LoginID = sessionStorage.getItem('LoginID');
    User.Password = this.SetNewPasswordForm.get('NewPassword').value;
    User.SecurityQuestion = this.SetNewPasswordForm.get('SecurityQuestion').value;
    User.SecurityAnswer = this.SetNewPasswordForm.get('SecurityAnswer').value;

    this.accountService.setNewPassword(User).subscribe((resp: any) => {

      if (resp.isSuccess == true) {
        sessionStorage.removeItem('LoginID');
        sessionStorage.removeItem('Token');
        this.router.navigate(['/login']);
      }
    });
  }
}

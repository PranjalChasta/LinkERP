import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { CustomValidators } from 'ngx-custom-validators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})

export class ForgotPasswordComponent implements OnInit {

  Loading: any = false;
  Alert: any = '';
  ForgotPasswordForm: FormGroup;

  Submitted = false;
  Step: any = 'Step1';
  constructor(private FB: FormBuilder,
    private accountService: AccountService,
    private router: Router) { }


  ngOnInit() {
    this.ForgotPasswordForm = this.FB.group({
      UserName: ['', [Validators.required]],
      ResetOption: ['Email'],
      SecurityQuestion: ['-1'],//, 
      SecurityAnswer: ['']
    });
  }

  get f() { return this.ForgotPasswordForm.controls; }

  SendEmailRequest() {

    this.Loading = true;
    this.accountService.sendForgetPasswordRequest(this.ForgotPasswordForm.get('UserName').value).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        this.Message = 'The mail has been sent to registerd email.\nPlease use reset password link to update new password';
        this.Alert = 'Success';
        this.Step = 'Step4';
      }
      else {
        this.Message = '';
        //this.Alert = 'Error';
      }
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
    });

  }
  Message: any = '';
  CheckSecurityQuestion() {

    this.Submitted = true;
    if (this.ForgotPasswordForm.invalid) {
      return;
    }

    this.Loading = true;
    let data = {
      LoginID: this.ForgotPasswordForm.get('UserName').value,
      SecurityQuestion: this.ForgotPasswordForm.get('SecurityQuestion').value,
      SecurityAnswer: this.ForgotPasswordForm.get('SecurityAnswer').value
    }

    this.accountService.getResetPasswordBySecurityQuestion(data).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        //  this.Alert = 'Success';
        sessionStorage.setItem('ResetPasswordCode', resp.data.resetPasswordLink);
        this.router.navigate(['/reset-password/' + resp.data.resetPasswordLink]);
      }
      else {
        this.Message = 'Invalid Security Question/Answer. \nPlease provide valid Security Question/Answer';
        this.Alert = 'Error';
      }
      this.Submitted = false;
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
    });

  }

  Continue() {
    debugger;
    if (this.Step == 'Step1') {
      this.Submitted = true;
      if (this.ForgotPasswordForm.invalid) {
        return;
      }
      this.accountService.checkUserName(this.ForgotPasswordForm.get('UserName').value).subscribe((resp: any) => {
        if (resp.data == true) {
          this.Step = 'Step2';
          this.ForgotPasswordForm.get('UserName').disable();
          this.Alert = '';
        }
        else {
          this.Message = 'Invalid User name.\nPlease provide valid Username';
          this.Alert = 'Error';
        }
        this.Submitted = false;
      }, (error: any) => {
        this.Message = 'Invalid User name.\nPlease provide valid Username';
        this.Alert = 'Error';
      });
    }
    else if (this.Step == 'Step2') {
      if (this.ForgotPasswordForm.get('ResetOption').value == 'Email') {
        this.SendEmailRequest();
      }
      else {
        // this.ForgotPasswordForm.get('').validator.apply()
        this.ForgotPasswordForm.get('SecurityQuestion').setValidators(CustomValidators.notEqual('-1'));
        this.ForgotPasswordForm.get('SecurityAnswer').setValidators(Validators.required);
        this.Step = 'Step3';
      }
    }
    else if (this.Step == 'Step3') {
      this.CheckSecurityQuestion();
    }

    //   this.ForgotPasswordForm.get('UserName').disable();
    //  // debugger;
    //   if (this.Step == 'Email') {
    //     this.Step = 'Option';
    //     this.Option = 'SendMail';
    //   }
    //   else if (this.Step == 'Option' && this.Option == 'SecurityQestion') {
    //     this.Step == 'SecurityQestion'
    //   }
  }
  Cancel() {
    this.router.navigate(['/login']);
  }


}

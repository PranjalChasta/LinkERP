import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';
import { LoginUser } from '../../models/utilities/login-user';

import { CryptoAes } from 'src/app/directives/crypto-aes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  Loading: boolean = false;
  LoginForm: FormGroup;
  constructor(private FB: FormBuilder,
    private router: Router,
    private accountService: AccountService, private cryptoAes: CryptoAes) { }

  ngOnInit() {
    if (localStorage.getItem('LoginID') != null) {
      this.router.navigate(['/home']);
    }
    this.CreateLoginForm();
  }
  CreateLoginForm() {
    this.LoginForm = this.FB.group({
      UserName: [''],
      Password: ['']
    });
  }

  Login() {
    let loginUser: any = new LoginUser();
    loginUser.LoginID = this.LoginForm.get('UserName').value;
    loginUser.Password = this.LoginForm.get('Password').value;
    this.Loading = true;
    this.accountService.authenticate(loginUser).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        debugger;
        let user: any = new LoginUser();
        user = resp.data.user;
        if (user.resetPassword == false) {
          sessionStorage.setItem('LoginID', user.loginID);
          sessionStorage.setItem('Token', user.token);
          this.router.navigate(['/set-new-password']);
        }
        else if (user.resetPassword == true) {
          if (user.forcePasswordChange == true) {
            sessionStorage.setItem('LoginID', user.loginID);
            sessionStorage.setItem('Token', user.token);
            this.router.navigate(['/force-change-password']);
            return;
          }

          localStorage.setItem('CompanyID', user.defaultCompanyID);
          debugger;
          if (user.loginAvator) {
            localStorage.setItem('LoginAvator', user.loginAvator);
          } else {
            localStorage.setItem('LoginAvator', '');
          }

          localStorage.setItem('LoginID', user.loginID);
          localStorage.setItem('LoginName', user.loginName);
          localStorage.setItem('CompanyID', user.defaultCompanyID);
          localStorage.setItem('Token', user.token);
          
          console.log(localStorage.getItem('LoginID'))
          this.accountService.getMenuPermissions(user.loginID, localStorage.getItem('CompanyID')).subscribe((menudata: any) => {
            debugger;

            console.log(menudata);
             let menus: any[] = menudata.menuPermissions;
             let modules: any[] =  menudata.modulePermissions

            if (menus.length == 0 && modules.length == 0 ) {
              this.router.navigate(['/no-access-permission']);
              
            }


            let Str_menuPermissions = JSON.stringify(menudata.menuPermissions);
            let Encymenus = this.cryptoAes.EncryptString(Str_menuPermissions);
            localStorage.setItem('MenuPermissions', JSON.stringify(Encymenus));

            let Str_modulePermissions = JSON.stringify(menudata.modulePermissions);
            let Encymodules = this.cryptoAes.EncryptString(Str_modulePermissions);
            localStorage.setItem('ModulePermissions', JSON.stringify(Encymodules));

            let Str_companiesPermissions = JSON.stringify(menudata.companiesPermissions);
            let Encycompanies = this.cryptoAes.EncryptString(Str_companiesPermissions);
            localStorage.setItem('CompaniesPermissions', JSON.stringify(Encycompanies));
         /*  localStorage.setItem('ModulePermissions',JSON.stringify(menudata.modulePermissions));
          localStorage.setItem('CompaniesPermissions',JSON.stringify(menudata.companiesPermissions)) */;
            this.router.navigate(['/home']);

          }, (error) => {
            this.Loading = false;
            //   console.error('Problem with the sevice. Please try later : ' + error);
          });
        }
        this.Loading = false;
      }
      else {
        this.LoginForm.patchValue({
          Password: ''
        })
        this.IsInvalidLogin = true;
        this.Loading = false;
      }
    }, (error: any) => {
      this.Loading = false;
    });
  }
  IsInvalidLogin: boolean = false;
  ResetPassword() {
    this.router.navigate(['/reset-password/id=abcd']);
  }

}

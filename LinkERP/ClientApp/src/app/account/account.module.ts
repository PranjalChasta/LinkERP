import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { SetNewPasswordComponent } from './set-new-password/set-new-password.component';
import { CryptoAes } from '../directives/crypto-aes';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SHAREModule } from '../shared/share.module';
import { NoAccessPermissionComponent } from './no-access-permission/no-access-permission.component';


const appRoute: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'set-new-password', component: SetNewPasswordComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'force-change-password', component: ChangePasswordComponent },
  { path: 'reset-password/:id', component: ResetPasswordComponent },
  { path: 'no-access-permission', component: NoAccessPermissionComponent }
];

@NgModule({
  declarations: [
    LoginComponent,
    SetNewPasswordComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
    NoAccessPermissionComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoute),
    FormsModule,
    ReactiveFormsModule,
    SHAREModule
  ],
  providers: [CryptoAes],
  exports: [
    LoginComponent,
    SetNewPasswordComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
    NoAccessPermissionComponent
  ]
})
export class AccountModule { }

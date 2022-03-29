import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../app-config.service';
@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private url: string = "";
  private baseUrl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseUrl = appConfigService.getServiceBaseUrl();
  }

  authenticate(data) {
    this.url = this.baseUrl + 'api/Account/Authenticate';
    return this.http.post(this.url, data);
  }
  GetConfigurataions(CompanyID){
    this.url = this.baseUrl + 'api/Account/GetConfigurataions/' + CompanyID;
    return this.http.get(this.url);
  }
  setNewPassword(data) {
    this.url = this.baseUrl + 'api/Account/SetNewPassword';
    return this.http.post(this.url, data);
  }
  getMenuPermissions(LoginID, CompanyID) {
    this.url = this.baseUrl + 'api/SHARED/SecurityPermissions/GetAccessPermissions/' + LoginID + '/' + CompanyID;
    return this.http.get(this.url);
  }

  sendForgetPasswordRequest(userName) {
    this.url = this.baseUrl + 'api/Account/SendForgetPasswordRequest/' + userName;
    return this.http.get(this.url);
  }

  resetPassword(data) {
    this.url = this.baseUrl + 'api/Account/ResetPassword/';
    return this.http.post(this.url, data);
  }

  IsResetPasswordExpired(code) {
    this.url = this.baseUrl + 'api/Account/IsResetPasswordExpired/';
    return this.http.post(this.url, code);
  }

  changePassword(data) {
    this.url = this.baseUrl + 'api/Account/ChangePassword/';
    return this.http.post(this.url, data);
  }
  updateLogOut(data) {
    this.url = this.baseUrl + 'api/Account/UpdateLogOut/' + data;
    return this.http.post(this.url, null);
  }
  getResetPasswordBySecurityQuestion(data) {
    this.url = this.baseUrl + 'api/Account/GetResetPasswordBySecurityQuestion';
    return this.http.post(this.url, data);
  }
  checkUserName(data) {
    this.url = this.baseUrl + 'api/Account/CheckUserName/' + data;
    return this.http.get(this.url, data);
  }
}

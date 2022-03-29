import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }

  getUsers() {
    this.url = this.baseurl + 'api/SYS/User/GetUsers';
    return this.http.get(this.url);
  }
  AddUsers(data) {
    this.url = this.baseurl + 'api/SYS/User/AddUser';
    return this.http.post(this.url, data);
  }
  UpdateUsers(data) {
    this.url = this.baseurl + 'api/SYS/User/UpdateUser';
    return this.http.post(this.url, data);
  }

  getUserByID(ID: any) {

    this.url = this.baseurl + 'api/SYS/User/GetUserByID/' + ID;
    return this.http.get(this.url);
  }

  deleteUserByID(ID, LoginID) {

    this.url = this.baseurl + 'api/SYS/User/DeleteUserByID/' + ID + '/' + LoginID;
    return this.http.post(this.url, null);
  }

  addUserRole(data) {
    this.url = this.baseurl + 'api/SYS/UserRoles/AddUserRole';
    return this.http.post(this.url, data);
  }

  getUserRolesByID(LoginID: string) {
    debugger;
    this.url = this.baseurl + 'api/SYS/UserRoles/GetUserRolesByID/' + LoginID;
    return this.http.get(this.url);
  }

  getRolesByID(LoginID: string) {
    debugger;
    this.url = this.baseurl + 'api/SYS/UserRoles/GetRolesByID/' + LoginID;
    return this.http.get(this.url);
  }
  getRolesByCompanyID(LoginID,DefaultCompany) {
    debugger;
    this.url = this.baseurl + 'api/SYS/UserRoles/GetRolesByCompanyID/' + LoginID+ '/' + DefaultCompany;
    return this.http.get(this.url);
  }
  resetAndSendPasswordMail(LoginID) {
    this.url = this.baseurl + 'api/SYS/User/ResetAndSendPasswordMail/' + LoginID;
    return this.http.get(this.url);
  }
  getSalespersons() {
    this.url = this.baseurl + 'api/SYS/User/GetSalesPerson';
    return this.http.get(this.url);
  }
  AddSalesPerson(data) {
    this.url = this.baseurl + 'api/SYS/User/AddupdateSalesPerson';
    return this.http.post(this.url, data);
  }
  geCompanyAccessByLoginID(LoginID) {
    debugger;
    this.url = this.baseurl + 'api/SYS/User/GeCompanyAccessByLoginID/' + LoginID;
    return this.http.get(this.url);
  }
  geWarehouseAccessByLoginID(LoginID,CompanyID) {
    debugger;
    this.url = this.baseurl + 'api/SYS/User/GeWareHouseAccessByLoginID/' + LoginID + '/' + CompanyID;;
    return this.http.get(this.url);
  }
}


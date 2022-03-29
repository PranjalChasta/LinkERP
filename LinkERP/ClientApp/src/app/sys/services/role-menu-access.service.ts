import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class RoleMenuAccessService {

  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }

  getRoleMenuAccessByRoleAndModule(RoleID, ModuleID) {
    this.url = this.baseurl + 'api/SYS/RoleMenuAccess/GetRoleMenuAccessByRoleAndModule/' + RoleID + '/' + ModuleID;
    return this.http.get(this.url);
  }
  getRoleMenuAccessByRole(RoleID) {
    this.url = this.baseurl + 'api/SYS/RoleMenuAccess/GetRoleMenuAccessByRole/' + RoleID;
    return this.http.get(this.url);
  }
}

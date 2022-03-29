import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';


@Injectable({
  providedIn: 'root'
})
export class RoleModuleAccessService {

  private url: string = "";
  private baseUrl: string = "";

  constructor(public http: HttpClient, private appCongfigService: AppConfigService) {
    this.baseUrl = appCongfigService.getServiceBaseUrl();
  }
  addRoleModuleAccess(data) {
    
    this.url = this.baseUrl + 'api/SYS/RoleModuleAccess/AddRoleModuleAccess';
    return this.http.post(this.url, data);
  }
  updateRoleModuleAccess(data){
    this.url = this.baseUrl + 'api/SYS/RoleModuleAccess/UpdateRoleModuleAccess';
    return this.http.post(this.url, data);
  }
  getRoleModuleAccessByID(ID: any) {
    this.url = this.baseUrl + 'api/SYS/RoleModuleAccess/GetRoleModuleAccesssByID/' + ID;
    return this.http.get(this.url);
  }
 
  deleteRoleModuleAccessByID(ID, LoginID) {
    
    this.url = this.baseUrl + 'api/SYS/RoleModuleAccess/DeleteRoleModuleAccessByID/' + ID + '/' + LoginID;
    return this.http.post(this.url, null);
  }
  getRoleModuleaccess() {
    
    this.url = this.baseUrl + 'api/SYS/RoleModuleAccess/GetRoleModuleAccess';
    return this.http.get(this.url);
  }
 
  }

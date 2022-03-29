import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private url: string = "";
  private baseUrl: string = "";

  constructor(public http: HttpClient, private appCongfigService: AppConfigService) {
    this.baseUrl = appCongfigService.getServiceBaseUrl();
  }
  getAllRoles() {
    this.url = this.baseUrl + 'api/SYS/Role/GetAllRoles';
    return this.http.get(this.url);
  }
  addRoles(data) {
    this.url = this.baseUrl + 'api/SYS/Role/AddRole';
    return this.http.post(this.url, data);
  }
  updateRoles(data) {
    this.url = this.baseUrl + 'api/SYS/Role/UpdateRole';
    return this.http.post(this.url, data);
  }
  getRoleByID(ID: any) {
    this.url = this.baseUrl + 'api/SYS/Role/GetRoleByID/' + ID;
    return this.http.get(this.url);
  }
  deleteRoleByID(ID, LoginID) {
    this.url = this.baseUrl + 'api/SYS/Role/DeleteRoleByID/' + ID + '/' + LoginID;
    return this.http.post(this.url, null);
  }

  //Role Company Access
  addRoleCompanyAccess(data) {
    this.url = this.baseUrl + 'api/SYS/RoleCompanyAccess/AddRoleCompanyAccess';
    return this.http.post(this.url, data);
  }
  DeleteRoleCompanyAccess(AccessRoleId,RoleID) {
    debugger;
    this.url = this.baseUrl + 'api/SYS/RoleCompanyAccess/DeleteRoleCompanyAccess/'+AccessRoleId+'/'+RoleID;
    return this.http.get(this.url);
  }

  getCompaniesExistsInRoleCompanyAccess(RoleID) {
    this.url = this.baseUrl + 'api/SYS/RoleCompanyAccess/GetCompaniesExistsInRoleCompanyAccess/' + RoleID;
    return this.http.get(this.url);
  }

  getRoleCompanyAccessByRoleID(roleId) {
    this.url = this.baseUrl + 'api/SYS/RoleCompanyAccess/GetRoleCompanyAccessByRoleID/' + roleId;
    return this.http.get(this.url);
  }

  getCompaniesNotExistsInRoleCompanyAccess(RoleID) {
    this.url = this.baseUrl + 'api/SYS/RoleCompanyAccess/GetCompaniesNotExistsInRoleCompanyAccess/' + RoleID;
    return this.http.get(this.url);
  }
  getWareHousesNotExistsInRoleWarehouseyAccess(RoleID,CompanyID) {
    this.url = this.baseUrl + 'api/SYS/RoleCompanyAccess/GetWareHousesNotExistsInRoleWarehouseyAccess/' + RoleID +'/'+CompanyID;
    return this.http.get(this.url);
  }
  getWareHousesExistsInRoleWarehouseyAccess(RoleID,CompanyID) {
    this.url = this.baseUrl + 'api/SYS/RoleCompanyAccess/GetWareHousesExistsInRoleWarehouseyAccess/' + RoleID +'/'+CompanyID;
    return this.http.get(this.url);
  }
  AddwarehouseAccess(data) {
    this.url = this.baseUrl + 'api/SYS/RoleCompanyAccess/AddRoleWarehouseAccess';
    return this.http.post(this.url, data);
  }
  getallwarehouse(CompanyID) {
    this.url = this.baseUrl + 'api/SYS/RoleCompanyAccess/GetWareHouses/' + CompanyID;
    return this.http.get(this.url);
  }
  addRoleModuleAccess(data) {
    this.url = this.baseUrl + 'api/SYS/RoleModuleAccess/AddRoleModuleAccess';
    return this.http.post(this.url, data);
  }
  DeleteModuleAccess(RoleID,ModuleID) {
    this.url = this.baseUrl + 'api/SYS/RoleModuleAccess/DeleteRoleModuleAccess/'+ RoleID+'/'+ModuleID;
    return this.http.get(this.url);
  }
  DeleteRoleWarehouseAccess(RoleID,WarehouseID,CompanyID) {
    debugger;
    this.url = this.baseUrl + 'api/SYS/RoleCompanyAccess/DeleteRoleWarehouseAccessByID/'+RoleID+'/'+WarehouseID +'/'+CompanyID;
    return this.http.get(this.url);
  }

  getModulesExistsInRoleModuleAccess(RoleID) {
    this.url = this.baseUrl + 'api/SYS/RoleModuleAccess/GetModulesExistsInRoleModuleAccess/' + RoleID;
    return this.http.get(this.url);
  }

  getModulesNotExistsInRoleModuleAccess(RoleID) {
    this.url = this.baseUrl + 'api/SYS/RoleModuleAccess/GetModulesNotExistsInRoleModuleAccess/' + RoleID;
    return this.http.get(this.url);
  }

  addUpdateRoleMenuAccess(data) {
    this.url = this.baseUrl + 'api/SYS/RoleMenuAccess/AddUpdateRoleMenuAccess';
    return this.http.post(this.url, data);
  }
  
}

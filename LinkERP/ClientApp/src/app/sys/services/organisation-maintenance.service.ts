import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';
@Injectable({
  providedIn: 'root'
})
export class OrganisationMaintenanceService {

  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }

  getCompanies() {
    this.url = this.baseurl + 'api/SYS/Company/GetCompanies';
    return this.http.get(this.url);
  }
  getAllCompanies() {
    this.url = this.baseurl + 'api/SYS/Company/GetAllCompanies';
    return this.http.get(this.url);
  }
  getCompanyByID(ID) {
    this.url = this.baseurl + 'api/SYS/Company/GetCompanyByID/' + ID;
    return this.http.get(this.url);
  }
  addCompany(data) {
    this.url = this.baseurl + 'api/SYS/Company/AddCompany';
    return this.http.post(this.url, data);
  }

  updateCompany(data) {
    this.url = this.baseurl + 'api/SYS/Company/UpdateCompany';
    return this.http.post(this.url, data);
  }

  deleteCompanyByID(ID, LoginID) {
    this.url = this.baseurl + 'api/SYS/Company/DeleteCompanyByID/' + ID + '/' + LoginID;
    return this.http.post(this.url, null);
  }

}

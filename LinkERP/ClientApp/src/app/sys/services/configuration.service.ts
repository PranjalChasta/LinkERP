import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  addConfiguration(data) {
    this.url = this.baseurl + 'api/SYS/Configuration/AddConfiguration';
    return this.http.post(this.url, data);
  }
  updateConfiguration(data) {
    this.url = this.baseurl + 'api/SYS/Configuration/UpdateConfiguration';
    return this.http.post(this.url, data);
  }
  getAllConfigurations() {
    this.url = this.baseurl + 'api/SYS/Configuration/GetAllConfigurations';
    return this.http.get(this.url);
  }
  getconfigurationByID(ID) {
    this.url = this.baseurl + 'api/SYS/Configuration/GetConfigurationByID/' + ID;
    return this.http.get(this.url);
  }
  getAllConfigurationByModuleID(ModuleId) {
    debugger;
    this.url = this.baseurl + 'api/SYS/Configuration/GetAllConfigurationByIDs/' + ModuleId;
    return this.http.get(this.url);
  }
  updateConfigurations(data) {
    this.url = this.baseurl + 'api/SYS/Configuration/UpdateConfigurations';
    return this.http.post(this.url, data);
  }
  

}

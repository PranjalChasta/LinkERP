import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';
@Injectable({
  providedIn: 'root'
})
export class UserRolesService {

  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }

  addUsers(data) {
    this.url = this.baseurl + 'api/SYS/UserRoles/AddUserRole';
    return this.http.post(this.url, data);
  }
}

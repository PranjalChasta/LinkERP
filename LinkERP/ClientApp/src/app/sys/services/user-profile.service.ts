import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }

  getUserByLoginID(LoginID) {
    this.url = this.baseurl + 'api/SYS/UserProfile/GetUserByLoginID/' + LoginID;
    return this.http.get(this.url);
  }
  updateUser(data) {
    this.url = this.baseurl + 'api/SYS/UserProfile/UpdateUser';
    return this.http.post(this.url, data);
  }
}

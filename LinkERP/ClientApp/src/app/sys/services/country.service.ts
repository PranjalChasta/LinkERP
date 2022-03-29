import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private url: string = "";
  private baseurl: string = "";

 constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
 }

  getCountryByID(CountryID) {
    this.url = this.baseurl + 'api/SYS/Country/GetCountryByID/' + CountryID;
    return this.http.get(this.url);
  }
  addCountry(data) {
    this.url = this.baseurl + 'api/SYS/Country/AddCountry';
    return this.http.post(this.url, data);
  }
  updateCountry(data) {
    this.url = this.baseurl + 'api/SYS/Country/UpdateCountry';
    return this.http.post(this.url, data);
  }
  deleteCountryByID(CountryID, DeletedBy) {
    this.url = this.baseurl + 'api/SYS/Country/DeleteCountryByID/' + CountryID + '/' + DeletedBy;
    return this.http.post(this.url, null);
  }
}

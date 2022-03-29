import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private url:string="";
  private baseurl:string="";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
 }
 
  getcheckboxcountries() {
  this.url = this.baseurl + 'api/SYS/Common/GetcheckboxCountries';
  return this.http.get(this.url);
}
getStateByCountryID(CountryID:any)
  {
    this.url =this.baseurl  + 'api/SYS/CountryState/GetStateByCountryID/' + CountryID;
    return this.http.get(this.url);
  }
getCityByStateID(StateID: any) {
    this.url = this.baseurl + 'api/SYS/CountryStateCity/GetCityByStateID/' + StateID;
    return this.http.get(this.url);
 }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class CountrystateService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
   }

  getCountryState()
  {
    this.url = this.baseurl + 'api/SYS/Common/GetCountryState';
    return this.http.get(this.url);
  }

  AddCountryState(data) {
    debugger
    this.url = this.baseurl + 'api/SYS/CountryState/AddCountryState';
    return this.http.post(this.url,data);
  }
  UpdateCountryState(data)
  {
    this.url = this.baseurl + 'api/SYS/CountryState/UpdateCountryState';
    return this.http.post(this.url,data);
  }

  getCountryStateByID(ID:any)
  {
    this.url =this.baseurl  + 'api/SYS/CountryState/GetCountryStateByID/' + ID;
    return this.http.get(this.url);
  }

  deleteCountryStateByID(ID, LoginID)
  {
    
    this.url = this.baseurl + 'api/SYS/CountryState/DeleteCountryStateByID/' + ID + '/' + LoginID;
    return this.http.post(this.url, null);
  }

  getStateByCountryID(CountryID:any)
  {
    this.url =this.baseurl  + 'api/SYS/CountryState/GetStateByCountryID/' + CountryID;
    return this.http.get(this.url);
  }
}

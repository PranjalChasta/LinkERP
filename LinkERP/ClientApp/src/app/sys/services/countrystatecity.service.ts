import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class CountrystatecityService {
  private url: string = "";
  private baseUrl: string = "";

  constructor(public http: HttpClient, private appCongfigService: AppConfigService) {
    this.baseUrl = appCongfigService.getServiceBaseUrl();
  }
  addCity(data) {
    
    this.url = this.baseUrl + 'api/SYS/CountryStateCity/AddCity';
    return this.http.post(this.url, data);
  }
  updateCity(data){
    this.url = this.baseUrl + 'api/SYS/CountryStateCity/UpdateCity';
    return this.http.post(this.url, data);
  }
  getCityByID(CityID: any) {
    this.url = this.baseUrl + 'api/SYS/CountryStateCity/GetCityByID/' + CityID;
    return this.http.get(this.url);
  }
 
  deleteCityByID(ID, LoginID) {
    
    this.url = this.baseUrl + 'api/SYS/CountryStateCity/DeleteCityByID/' + ID + '/' + LoginID;
    return this.http.post(this.url, null);
  }

  getCityByStateID(StateID: any) {
    this.url = this.baseUrl + 'api/SYS/CountryStateCity/GetCityByStateID/' + StateID;
    return this.http.get(this.url);
  }
}

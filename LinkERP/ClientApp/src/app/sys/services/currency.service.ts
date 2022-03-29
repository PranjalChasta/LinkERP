import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private url: string = "";
  private baseurl: string = "";

 constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
 }
 getcurrency() {
  
  this.url = this.baseurl + 'api/SYS/Currency/GetCurrencies';
  return this.http.get(this.url);
}
addCurrency(data) {
  
  this.url = this.baseurl + 'api/SYS/Currency/AddCurrency';
  return this.http.post(this.url, data);
}
updateCurrency(data){
  this.url = this.baseurl + 'api/SYS/Currency/UpdateCurrency';
  return this.http.post(this.url, data);
}
getCurrencyByID(ID: any) {
  
  this.url = this.baseurl + 'api/SYS/Currency/GetCurrencyByID/' + ID;
  return this.http.get(this.url);
}

}

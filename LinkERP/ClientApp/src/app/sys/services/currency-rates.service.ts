import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyRatesService {
  private url: string = "";
  private baseurl: string = "";

 constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
 }
 getcurrencyrates() {
  
  this.url = this.baseurl + 'api/SYS/Currency/GetCurrencyRates';
  return this.http.get(this.url);
}
getcurrencyratesexchange(CurrencyID:any) {
  
  this.url = this.baseurl + 'api/SYS/Currency/GetCurrencyRatesExchange/'+CurrencyID;
  return this.http.get(this.url);
}
//getcurrency() {
  
//  this.url = this.baseurl + 'api/SHARED/TableData/GetLookup';
//  return this.http.get(this.url);
//}

getCurrencyRateByTableID(TableID: any) {
  this.url = this.baseurl + 'api/SHARED/TableData/GetLookupByID/' + TableID;
  return this.http.get(this.url);
}
addCurrencyRate(data) {
  
  this.url = this.baseurl + 'api/SYS/Currency/AddCurrencyRate';
  return this.http.post(this.url, data);
}
updateCurrencyRate(data){
  this.url = this.baseurl + 'api/SYS/Currency/UpdateCurrencyRate';
  return this.http.post(this.url, data);
}
getCurrencyRateByID(ID: any) {
  this.url = this.baseurl + 'api/SYS/Currency/GetCurrencyRateByID/' + ID;
  return this.http.get(this.url);
}

deleteCurrencyRateByID(ID, LoginID) {
  
  this.url = this.baseurl + 'api/SYS/Currency/DeleteJobByID/' + ID + '/' + LoginID;
  return this.http.post(this.url, null);
}
}

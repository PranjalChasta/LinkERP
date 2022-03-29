import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';


@Injectable({
  providedIn: 'root'
})
export class TaxCodeDetailsService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  getAllTaxCodeDetails() {
    this.url = this.baseurl + 'api/SYS/TaxCodeDetails/GetAllTaxCodeDetails';
    return this.http.get(this.url);
  }
  addTaxCodeDetails(data) {
    this.url = this.baseurl + 'api/SYS/TaxCodeDetails/AddTaxCodeDetails';
    return this.http.post(this.url, data);
  }
  updateTaxCodeDetails(data) {
    this.url = this.baseurl + 'api/SYS/TaxCodeDetails/UpdateTaxCodeDetails';
    return this.http.post(this.url, data);
  }
  getTaxCodeDetailsByID(ID) {
    this.url = this.baseurl + 'api/SYS/TaxCodeDetails/GetTaxCodeDetailsByID/' + ID;
    return this.http.get(this.url);
  }
  getTaxCodeDetailsByTaxCodeID(ID) {
    this.url = this.baseurl + 'api/SYS/TaxCodeDetails/GetTaxCodeDetailsByTaxCodeID/' + ID;
    return this.http.get(this.url);
  }
  AddupdateWorkFlowDetails(data){
    debugger;
    this.url = this.baseurl + 'api/SYS/TaxCodeDetails/AddUpdateTaxcodeData';
    return this.http.post(this.url, data);
  }
}

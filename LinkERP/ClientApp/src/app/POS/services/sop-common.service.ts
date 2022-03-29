import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/app-config.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SopCommonService {

  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  } 
  GetQuotationMains() {
    this.url = this.baseurl + 'api/POS/Common/GetQuotationMains';
    return this.http.get(this.url);
  }
  
  GetPriceWorkflowOptions() {
    this.url = this.baseurl + 'api/POS/Common/GetPriceWorkflowOptions';
    return this.http.get(this.url);
  }
  GetShifts() {
    this.url = this.baseurl + 'api/POS/Common/GetShifts';
    return this.http.get(this.url);
  }
}

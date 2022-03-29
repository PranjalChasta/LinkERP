import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class LandedCostInvoicesService {
  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
   }
   getLandedCostInvoicesByCostID(CostID) {
     
    this.url = this.baseurl + 'api/PUR/LandedCostInvoices/LandedCostInvoices/GetLandedCostInvoicesCostID/'+ CostID;
    return this.http.get(this.url);
  }

  addLandedCostInvoices(data) {
    debugger;
    this.url = this.baseurl + 'api/PUR/LandedCostInvoices/LandedCostInvoices/AddLandedCostInvoices';
    return this.http.post(this.url, data);
  }
  updateLandedCostInvoices(data) {
    this.url = this.baseurl + 'api/PUR/LandedCostInvoices/LandedCostInvoices/UpdateLandedCostInvoices';
    return this.http.post(this.url, data);
  }

  getLandedCostInvoicesByID(ID) {
    this.url = this.baseurl + 'api/PUR/LandedCostInvoices/LandedCostInvoices/GetLandedCostInvoicesByID/'+ ID;
    return this.http.get(this.url);
  }
  getLedger()
  {
    this.url = this.baseurl + 'api/PUR/Vendor/GetLedger';
    return this.http.get(this.url);
  }

  submitLandedCostInvoices(data){
    this.url = this.baseurl + 'api/PUR/LandedCostInvoices/LandedCostInvoices/SubmitLandedCostInvoices';
    return this.http.post(this.url, data);
  }
}

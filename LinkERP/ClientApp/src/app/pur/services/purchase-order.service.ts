import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})

export class PurchaseOrderService {
  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  getPurchaseMainValidityDays(VendorID) {
    this.url = this.baseurl + 'api/PUR/PurchaseMain/PurchaseMain/GetPurchaseMainValidityDays/' + VendorID ;
    return this.http.get(this.url);
  }

  getPurchaseMain() {
    this.url = this.baseurl + 'api/PUR/PurchaseMain/PurchaseMain/GetAllPurchaseMain';
    return this.http.get(this.url);
  }
  getPurchaseOrderByID(ID) {
    this.url = this.baseurl + 'api/PUR/PurchaseMain/PurchaseMain/GetPurchaseMainByID/' + ID;
    return this.http.get(this.url);
  }

  addPurchaseOrder(data) {
    this.url = this.baseurl + 'api/PUR/PurchaseMain/PurchaseMain/AddPurchaseMain';
    return this.http.post(this.url, data);
  }
  updatePurchaseOrder(data) {
    this.url = this.baseurl + 'api/PUR/PurchaseMain/PurchaseMain/UpdatePurchaseMain';
    return this.http.post(this.url, data);
  }

  getVendorWareHouse() {
    this.url = this.baseurl + 'api/PUR/PurchaseTemplate/PurchaseTemplate/GetVendorWareHouse';
    return this.http.get(this.url);
  }

  approvePurchaseOrder(data){
    this.url = this.baseurl + 'api/PUR/PurchaseMain/PurchaseMain/ApprovePurchaseOrder';
    return this.http.post(this.url, data);
  }
  updatePurchaseStatus(data) {
    this.url = this.baseurl + 'api/PUR/PurchaseMain/PurchaseMain/UpdatePurchaseStatus';
    return this.http.post(this.url, data);
  }
  GetTaxTotalRateByTaxid(Taxid){
    this.url = this.baseurl + 'api/PUR/PurchaseMain/PurchaseMain/GetTaxTotalRateByTaxid/' + Taxid;
    return this.http.get(this.url);
  }
  GetAllTaxCodesForPO() {
    this.url = this.baseurl + 'api/PUR/PurchaseMain/PurchaseMain/GetAllTaxCodesForPO';
    return this.http.get(this.url);
  }
  GetOrderaudit(PurchaseOrderID,CompanyID) {
    debugger;
    this.url = this.baseurl + 'api/PUR/PurchaseMainDetail/PurchaseMainDetail/GetOrderaudit/' + PurchaseOrderID+ '/' + CompanyID;
    return this.http.get(this.url);
  }
  checkVenderpurchased(vendorID,ProductID) {
    debugger;
    this.url = this.baseurl + 'api/PUR/PurchaseMainDetail/PurchaseMainDetail/CheckVenderpurchased/' + vendorID+ '/' + ProductID;
    return this.http.get(this.url);
  }
}

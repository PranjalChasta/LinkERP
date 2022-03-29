import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class PurCommonService {

  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  getCustomers() {
    this.url = this.baseurl + 'api/PUR/Vendor/GetCustomers';
    return this.http.get(this.url);
  }
  getPurchaseLandedCost() {
    this.url = this.baseurl + 'api/PUR/Vendor/GetPurchaseLandedCost';
    return this.http.get(this.url);
  }
  getLandedCostInvoices() {
    this.url = this.baseurl + 'api/PUR/Vendor/GetLandedCostInvoices';
    return this.http.get(this.url);
  }
  getPurchaseMain() {
    this.url = this.baseurl + 'api/PUR/Vendor/GetPurchaseMain';
    return this.http.get(this.url);
  }
  getPurchaseDetails() {
    this.url = this.baseurl + 'api/PUR/Vendor/GetPurchaseDetails';
    return this.http.get(this.url);
  }
  getActiveLandedCost() {
    this.url = this.baseurl + 'api/PUR/Vendor/GetPurchaseLandedCost';
    return this.http.get(this.url);
  }
  getTenderType() {
    this.url = this.baseurl + 'api/POS/TenderTypes/GetTenderTypes';
    return this.http.get(this.url);
  }
  getPurchaseOrderBySearch(SearchObject) {
    this.url = this.baseurl + 'api/PUR/Common/GetPurchaseOrderBySearch';
    return this.http.post(this.url, SearchObject);
  }

  getAllVendorPriceScheme() {
    this.url = this.baseurl + 'api/PUR/Vendor/GetAllVendorPriceScheme';
    return this.http.get(this.url);
  }
  
  getPurchaseRequisitionNumber() {
    this.url = this.baseurl + 'api/PUR/Common/GetPurchaseRequisitionNumber';
    return this.http.get(this.url);
  }
  getPurchaseOrderNumbers() {
    this.url = this.baseurl + 'api/PUR/Common/GetPurchaseOrderNumbers';
    return this.http.get(this.url);
  }
  getInvetoryForPO() {
    this.url = this.baseurl + 'api/PUR/Common/GetInvetoryForPO';
    return this.http.get(this.url);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseInvoiceService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  addPurchaseInvoice(data) {
    this.url = this.baseurl + 'api/PUR/PurchaseInvoice/PurchaseInvoice/AddPurchaseInvoice';
    return this.http.post(this.url, data);
  }
  updatePurchaseInvoice(data) {
    this.url = this.baseurl + 'api/PUR/PurchaseInvoice/PurchaseInvoice/UpdatePurchaseInvoice';
    return this.http.post(this.url, data);
  }
  getAllPurchaseInvoice() {
    this.url = this.baseurl + 'api/PUR/PurchaseInvoice/PurchaseInvoice/GetAllPurchaseInvoice';
    return this.http.get(this.url);
  }
  getPurchaseInvoiceByID(ID) {
    this.url = this.baseurl + 'api/PUR/PurchaseInvoice/PurchaseInvoice/GetPurchaseInvoiceByID/' + ID;
    return this.http.get(this.url);
  }
  ActivatePurInvoice(ID) {
    this.url = this.baseurl + 'api/PUR/PurchaseInvoice/PurchaseInvoice/ActivatePurInvoice/' + ID;
    return this.http.get(this.url);
  }

  getPurchaseGRNList(VendorID){
    this.url = this.baseurl + 'api/PUR/PurchaseInvoice/PurchaseInvoice/GetGRNByVendorID/' + VendorID;
    return this.http.get(this.url);
  }
  getPurchaseInvoiceDetailsByID(ID,ProductType){
    this.url = this.baseurl + 'api/PUR/PurchaseInvoiceDetail/PurchaseInvoiceDetail/GetPurchaseInvoiceDetailsByID/' + ID+'/'+ProductType;
    return this.http.get(this.url);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';


@Injectable({
  providedIn: 'root'
})
export class VendorPriceSchemeService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  addvendorscheme(data) {
    debugger;
    this.url = this.baseurl + 'api/INV/VendorPriceScheme/AddVendorPriceScheme';
    return this.http.post(this.url, data);
  }

  updatevendorscheme(data) {
    this.url = this.baseurl + 'api/INV/VendorPriceScheme/UpdateVendorScheme';
    return this.http.post(this.url, data);
  }
  getvendorschemeByID(ID) {
    this.url = this.baseurl + 'api/INV/VendorPriceScheme/GetVendorSchemeByID/' + ID;
    return this.http.get(this.url);
  }
  getAllVendorScheme() {
    this.url = this.baseurl + 'api/INV/VendorPriceScheme/GetAllVendorScheme';
    return this.http.get(this.url);
  }
  getPurchaseOrderList(VendorId, VendorPriceSchemeID) {
    this.url = this.baseurl + 'api/INV/VendorPriceScheme/GetPurchaseOrderList/' + VendorId + '/' + VendorPriceSchemeID;
    return this.http.get(this.url);
  }
  getPurchaseOrderRaisedAndreceived(VendorPriceSchemeID) {
    this.url = this.baseurl + 'api/INV/VendorPriceScheme/GetPurchaseOrderRaisedAndRecieved/' + VendorPriceSchemeID;
    return this.http.get(this.url);
  }
  createPurchaseOrder(data) {
    this.url = this.baseurl + 'api/INV/VendorPriceScheme/CraetePurchaseOrder';
    return this.http.post(this.url, data);
  }
}

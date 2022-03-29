import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseGRNDetailsService {

  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  getpurchaseGRNDetails() {
    debugger;
    this.url = this.baseurl + 'api/PUR/PurchaseGRNDetail/PurchaseGRNDetails/GetPurchaseGRNDetails';
    return this.http.get(this.url);
  }
  getpurchaseGRNDetailsByGRNID(GRNID) {
    debugger;
    this.url = this.baseurl + 'api/PUR/PurchaseGRNDetail/PurchaseGRNDetails/GetPurchaseGRNDetailsByGRNID/'+GRNID;
    return this.http.get(this.url);
  }
   getpurchaseGRNDetailsByPurchaseorderID(PurchaseOrderID,GRNID) {
    debugger;
    this.url = this.baseurl + 'api/PUR/PurchaseGRNDetail/PurchaseGRNDetails/GetPurchaseGRNDetailsByPurchaseOrderID/'+PurchaseOrderID+ '/' + GRNID;
    return this.http.get(this.url);
  }
  addpurchaseGRNDetails(data) {
    debugger;
    this.url = this.baseurl + 'api/PUR/PurchaseGRNDetail/PurchaseGRNDetails/AddPurchaseGRNDetails';
    return this.http.post(this.url, data);
  }

  updatepurchaseGRNDetails(data) {
    debugger;
    this.url = this.baseurl + 'api/PUR/PurchaseGRNDetail/PurchaseGRNDetails/UpdatePurchaseGRNDetails';
    return this.http.post(this.url, data);
  }
  getpurchaseGRNDetailsByID(ID) {
    this.url = this.baseurl + 'api/PUR/PurchaseGRNDetail/PurchaseGRNDetails/GetPurchaseGRNDetailsByID/'+ ID;
    return this.http.get(this.url);
  }
  getAllPurchaseInvoice() {
    this.url = this.baseurl + 'api/PUR/PurchaseInvoice/PurchaseInvoice/GetAllPurchaseInvoice';
    return this.http.get(this.url);
    }

    updateGRNDetailslist(data) {
      debugger;
      this.url = this.baseurl + 'api/PUR/PurchaseGRNDetail/PurchaseGRNDetails/UpdatePurchaseGRNDetailslist';
      return this.http.post(this.url, data);
  }
}


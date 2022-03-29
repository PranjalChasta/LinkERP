import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseGoodsReceiveNoteService {

  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  getpurchasegoodsreceivenote() {
    debugger;
    this.url = this.baseurl + 'api/PUR/PurchaseGoodsReceiveNote/PurchaseGoodsReceiveNote/GetPurchaseGoodsReceiveNote';
    return this.http.get(this.url);
  }
  addpurchasegoodsreceivenote(data) {
    debugger;
    this.url = this.baseurl + 'api/PUR/PurchaseGoodsReceiveNote/PurchaseGoodsReceiveNote/AddPurchaseGoodsReceiveNote';
    return this.http.post(this.url, data);
  }

  updatepurchasegoodsreceivenote(data) {
    this.url = this.baseurl + 'api/PUR/PurchaseGoodsReceiveNote/PurchaseGoodsReceiveNote/UpdatePurchaseGoodsReceiveNote';
    return this.http.post(this.url, data);
  }
  getpurchasegoodsreceivenoteByID(ID) {
    this.url = this.baseurl + 'api/PUR/PurchaseGoodsReceiveNote/PurchaseGoodsReceiveNote/GetPurchaseGoodsReceiveNoteByID/'+ ID;
    return this.http.get(this.url);
  }
  getAllPurchaseInvoice() {
    this.url = this.baseurl + 'api/PUR/PurchaseInvoice/PurchaseInvoice/GetAllPurchaseInvoice';
    return this.http.get(this.url);
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class GoodsReceivedNotesService {

  private url: string = "";
  private baseurl: string = ""; 
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }

  getAllGoodsReceivedNotes() {
    this.url = this.baseurl + 'api/PUR/GoodsReceivedNote/GetAllGoodsReceivedNotes';
    return this.http.get(this.url);
  }
  getPurchaseOrderDetails(purchaseOrderID) {
    this.url = this.baseurl + 'api/PUR/GoodsReceivedNote/GetPurchaseOrderDetails/' + purchaseOrderID;
    return this.http.get(this.url);
  }

  addPurchasegoodsreceivenote(data) {
    this.url = this.baseurl + 'api/PUR/GoodsReceivedNote/addPurchaseGoodsReceiveNote/';
    return this.http.post(this.url, data);
  }

  updatePurchaseGoodsReceiveNote(data) {
    this.url = this.baseurl + 'api/PUR/GoodsReceivedNote/updatePurchaseGoodsReceiveNote/';
    return this.http.post(this.url, data);
  }
  GetGRNbyID(GRNID) {
    this.url = this.baseurl + 'api/PUR/GoodsReceivedNote/GetGRNbyID/' + GRNID;
    return this.http.get(this.url);
  }
  EditPurchasegoodsreceivenote(data) {
    this.url = this.baseurl + 'api/PUR/GoodsReceivedNote/EditPurchaseGoodsReceiveNote/';
    return this.http.post(this.url, data);
  }
  getProductMatrixByRecID(ProductID, PurchaseDetailID) {
    this.url = this.baseurl + 'api/PUR/GoodsReceivedNote/GetProductMatrixByRecID/' + ProductID + '/' + PurchaseDetailID;
    return this.http.get(this.url);
  }
  UpdateGRNDetailsProductStyleMatrixList(data) {
    this.url = this.baseurl + 'api/PUR/GoodsReceivedNote/UpdateGRNDetailsProductStyleMatrixList';
    return this.http.post(this.url, data);
  }
  ChangeGRNStatus(ID) {
    this.url = this.baseurl + 'api/PUR/GoodsReceivedNote/ChangeGRNStatus/' + ID;
    return this.http.post(this.url, null);
  }

  ReverseGRNStatus(ID) {
    this.url = this.baseurl + 'api/PUR/GoodsReceivedNote/ReverseGRNStatus/' + ID ;
    return this.http.post(this.url, null);
  }
  CreatePurchaseInvoice(ID) {
    this.url = this.baseurl + 'api/PUR/GoodsReceivedNote/CreatePurchaseInvoice/' + ID;
    return this.http.post(this.url, null);
  }
  
}

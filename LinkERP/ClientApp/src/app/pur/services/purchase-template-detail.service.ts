import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseTemplateDetailService {
  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) { 
    this.baseurl = appConfigService.getServiceBaseUrl();
  }

  getPurchaseTemplateByID(ID) {
    debugger;
    this.url = this.baseurl + 'api/PUR/PurchaseTemplateDetail/PurchaseTemplateDetail/GetPurchaseTemplateDetailByID/' + ID;
    return this.http.get(this.url);
  }
  addPurchaseTemplateDetail(data) {
    debugger;
    this.url = this.baseurl + 'api/PUR/PurchaseTemplateDetail/PurchaseTemplateDetail/AddPurchaseTemplateDetail';
    return this.http.post(this.url, data);
  }
  UpdatePurchaseTemplateDetail(data)
  {
    this.url = this.baseurl + 'api/PUR/PurchaseTemplateDetail/PurchaseTemplateDetail/UpdatePurchaseTemplateDetail';
    return this.http.post(this.url, data);
  }
  
   deletePurchaseTemplateDetailID(ID, TableName, DeletedBy) {
    this.url = this.baseurl + 'api/SHARED/DeleteRecords/DeleteRecordsBYID/' + ID + '/' + TableName + '/' + DeletedBy;
    return this.http.post(this.url, null);
  }
   getPurchaseTemplateDetail() {
    debugger;
    this.url = this.baseurl + 'api/PUR/PurchaseTemplateDetail/PurchaseTemplateDetail/GetAllPurchaseTemplateDetail';
    return this.http.get(this.url);
  }
  getClassificationDetail() {
    debugger;
    this.url = this.baseurl + 'api/PUR/PurchaseTemplateDetail/PurchaseTemplateDetail/GetClassification';
    return this.http.get(this.url);
  }

  getInventories()
  {
    this.url = this.baseurl + 'api/INV/Inventory/GetAllInventories';
    return this.http.get(this.url);
  }

}

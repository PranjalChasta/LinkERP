import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseTemplateService {
  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  getPurchaseTemplateByID(ID) { 
    this.url = this.baseurl + 'api/PUR/PurchaseTemplate/PurchaseTemplate/GetPurchaseTemplateByID/' + ID;
    return this.http.get(this.url);
  }
  addPurchaseTemplate(data) { 
    this.url = this.baseurl + 'api/PUR/PurchaseTemplate/PurchaseTemplate/AddPurchaseTemplate';
    return this.http.post(this.url, data);
  }
  UpdatePurchaseTemplate(data) {
    this.url = this.baseurl + 'api/PUR/PurchaseTemplate/PurchaseTemplate/UpdatePurchaseTemplate';
    return this.http.post(this.url, data);
  }
  deletePurchaseTemplateByID(ID, TableName, DeletedBy) {
    this.url = this.baseurl + 'api/SHARED/DeleteRecords/DeleteRecordsBYID/' + ID + '/' + TableName + '/' + DeletedBy;
    return this.http.post(this.url, null);
  }
  getPurchaseTemplate() {
    this.url = this.baseurl + 'api/PUR/PurchaseTemplate/PurchaseTemplate/GetAllPurchaseTemplate';
    return this.http.get(this.url);
  }
  getWareHouse() {
    this.url = this.baseurl + 'api/INV/Common/GetWareHouseKit';
    return this.http.get(this.url);
  }

  getVendor() {
    this.url = this.baseurl + 'api/PUR/Vendor/GetVendors';
    return this.http.get(this.url);
  }
  getVendorWareHouse() {
    this.url = this.baseurl + 'api/PUR/PurchaseTemplate/PurchaseTemplate/GetVendorWareHouse';
    return this.http.get(this.url);
  }
  getActivePurchaseTemplates() {
    this.url = this.baseurl + 'api/PUR/Vendor/GetPurchaseTemplate';
    return this.http.get(this.url);
  }

  createPOFromTemplete(TempleteID, CreatedBy) {
    this.url = this.baseurl + 'api/PUR/PurchaseTemplate/PurchaseTemplate/CreatePOFromTemplete/' + TempleteID + '/' + CreatedBy;
    return this.http.post(this.url, null);
  }
  SearchPurchaseTemplate(data) { 
    this.url = this.baseurl + 'api/PUR/PurchaseTemplate/PurchaseTemplate/SearchPurchaseTemplate';
    return this.http.post(this.url, data);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryDetailService {

  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }

  getAllInventoryDetails() {
    this.url = this.baseurl + 'api/INV/InventoryDetail/InventoryDetail/GetAllInventoryDetails';
    return this.http.get(this.url);
  }
  addInventoryDetail(data) {
    this.url = this.baseurl + 'api/INV/InventoryDetail/InventoryDetail/AddInventoryDetail';
    return this.http.post(this.url, data);
  }
  updateInventoryDetail(data) {
    this.url = this.baseurl + 'api/INV/InventoryDetail/InventoryDetail/UpdateInventoryDetail';
    return this.http.post(this.url, data);
  }
  getInventoryDetailsByID(ID) {
    this.url = this.baseurl + 'api/INV/InventoryDetail/InventoryDetail/GetInventoryDetailsByID/' + ID;
    return this.http.get(this.url);
  }
  getInventoryDetailByID(ID) {
    this.url = this.baseurl + 'api/INV/InventoryDetail/InventoryDetail/GetInventoryDetailByID/' + ID;
    return this.http.get(this.url);
  }
  deleteInventoryDetailsByID(ID, WarehouseID, LoginID, ActionName) {
    this.url = this.baseurl + 'api/INV/InventoryDetail/InventoryDetail/DeleteInventoryDetailsByID/' + ID + '/' + WarehouseID + '/' + LoginID + '/' + ActionName;
    return this.http.post(this.url, null);
  }
  getInventoryDetailsByInventryID(InventryID) {
    this.url = this.baseurl + 'api/INV/InventoryDetail/InventoryDetail/GetInventoryDetailsByInventryID/' + InventryID;
    return this.http.get(this.url);
  }
  AvailableStocktoDeleteWarehouse(ID,ProductID, WarehouseID) {
    this.url = this.baseurl + 'api/INV/InventoryDetail/InventoryDetail/AvailableStocktoDeleteWarehouse/'+ ID + '/' + ProductID + '/' + WarehouseID;
    return this.http.get(this.url);
  }
  getInventoryGLClassifications() {
    this.url = this.baseurl + 'api/PUR/PurchaseTemplateDetail/PurchaseTemplateDetail/GetClassifications';
    return this.http.get(this.url);
  }
}

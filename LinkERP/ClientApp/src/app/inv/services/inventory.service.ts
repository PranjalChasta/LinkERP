import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private url: string = "";
  private baseurl: string = "";


  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  getInventories() {

    this.url = this.baseurl + 'api/INV/Inventory/GetAllInventories';
    return this.http.get(this.url);
  }

  addInventory(data) {
    this.url = this.baseurl + 'api/INV/Inventory/AddInventory';
    return this.http.post(this.url, data);
  }
  updateinventoryPrescription(data) {
    debugger;
    this.url = this.baseurl + 'api/INV/Inventory/UpdateInventoryPrescription';
    return this.http.post(this.url, data);
  }

  updateInventory(data) {
    this.url = this.baseurl + 'api/INV/Inventory/UpdateInventory';
    return this.http.post(this.url, data);
  }
  getInventoryByID(ID) {
    this.url = this.baseurl + 'api/INV/Inventory/GetInventoryByID/' + ID;
    return this.http.get(this.url);
  }
  getInventoryBySearchKey(data) {
    this.url = this.baseurl + 'api/INV/Inventory/GetInventoriesBySearchKey';
    return this.http.post(this.url, data);
  }
  getInventoryPriceUpdate() {

    this.url = this.baseurl + 'api/INV/Utilities/GetInventoryPriceUpdate';
    return this.http.get(this.url);
  }
  addInventoryPriceUpdate(data) {
    debugger;
    this.url = this.baseurl + 'api/INV/Utilities/AddInventoryPriceUpdate';
    return this.http.post(this.url, data);
  }
  InventoryPriceUpdateByID(ID: any) {
    this.url = this.baseurl + 'api/INV/Utilities/GetInventoryPriceUpdateByID/' + ID;
    return this.http.get(this.url);
  }
  updateInventoryPriceUpdate(data) {
    debugger;
    this.url = this.baseurl + 'api/INV/Utilities/UpdateInventoryPriceUpdate';
    return this.http.post(this.url, data);
  }
  checkStatusForActive(ID) {
    this.url = this.baseurl + 'api/INV/Inventory/CheckStatusForActive/' + ID;
    return this.http.get(this.url);
  }
  checkStatusEnableForComponent(ID) {
    this.url = this.baseurl + 'api/INV/Inventory/CheckStatusEnableForComponent/' + ID;
    return this.http.get(this.url);
  }

  GetProductStockCount(ProductID) {
    this.url = this.baseurl + 'api/INV/Inventory/GetProductStockCount/' + ProductID;
    return this.http.get(this.url);
  }
  AvailableStocktoDelete(ProductID) {
    this.url = this.baseurl + 'api/INV/Inventory/AvailableStocktoDelete/' + ProductID;
    return this.http.get(this.url);
  }

  GetProductPurchasedCount(ProductID, UnitOfMeasureID) {
    this.url = this.baseurl + 'api/INV/Inventory/GetProductPurchasedCount/' + ProductID + '/' + UnitOfMeasureID;
    return this.http.get(this.url);
  }
  deleteInventory(ProductID) {
    this.url = this.baseurl + 'api/INV/Inventory/DeleteInventory/' + ProductID ;
    return this.http.get(this.url);
  }
  // InventoryPriceUpdateByID(ID: any) {
  //   this.url = this.baseurl + 'api/INV/Utilities/GetInventoryPriceUpdateByID/' + ID;
  //   return this.http.get(this.url);
  // }
  //updateInventoryPriceUpdate(data) {
  //  debugger;
  //  this.url = this.baseurl + 'api/INV/Utilities/UpdateInventoryPriceUpdate';
  //  return this.http.post(this.url, data);
  //}
}

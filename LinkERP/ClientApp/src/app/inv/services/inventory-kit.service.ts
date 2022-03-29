import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryKitService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  getAllInventoryKit() {
    this.url = this.baseurl + 'api/INV/InventoryKit/InventoryKit/GetAllInventoryKit';
    return this.http.get(this.url);
  }
  addInventoryKit(data) {
    this.url = this.baseurl + 'api/INV/InventoryKit/InventoryKit/AddInventoryKit';
    return this.http.post(this.url, data);
  }
  updateInventoryKit(data) {
    this.url = this.baseurl + 'api/INV/InventoryKit/InventoryKit/UpdateInventoryKit';
    return this.http.post(this.url, data);
  }
  getInventoryKitByInventoryID(InventryID) {
    this.url = this.baseurl + 'api/INV/InventoryKit/InventoryKit/GetInventoryKitByInventryID/' + InventryID;
    return this.http.get(this.url);
  }
  getinventorykitbyid(ID){
    this.url = this.baseurl + 'api/INV/InventoryKit/InventoryKit/GetInventoryKitByID/' + ID;
    return this.http.get(this.url);
  }
 
}

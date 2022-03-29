import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/app-config.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InventoryAdjustmentService {
  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
   }
   addInventoryAdjustment(data) {
    this.url = this.baseurl + 'api/INV/InventoryAdjustment/InventoryAdjustment/AddInventoryAdjustment';
    return this.http.post(this.url, data);
  }

  UpdateInventoryAdjustment(data)
  {
    this.url = this.baseurl + 'api/INV/InventoryAdjustment/InventoryAdjustment/UpdateInventoryAdjustment';
    return this.http.post(this.url, data);
  }
  getInventoryAdjustmentByID(ID) {
    debugger;
    this.url = this.baseurl + 'api/INV/InventoryAdjustment/InventoryAdjustment/GetInventoryAdjustmentByID/' + ID;
    return this.http.get(this.url);
  }
  getInventoryAdjustment()
  {
    this.url = this.baseurl + 'api/INV/InventoryAdjustment/InventoryAdjustment/GetAllInventoryAdjustment';
    return this.http.get(this.url);
  }
  getUomforAdjustmentDetail()
  {
    this.url = this.baseurl + 'api/INV/InventoryAdjustmentDetail/InventoryAdjustmentDetail/GetUomforAdjustmentDetail';
    return this.http.get(this.url);
  }

  updateInventoryAdjustmentStatus(data)
  {
    this.url = this.baseurl + 'api/INV/InventoryAdjustment/InventoryAdjustment/UpdateInventoryAdjustmentStatus';
    return this.http.post(this.url, data);
  }
}

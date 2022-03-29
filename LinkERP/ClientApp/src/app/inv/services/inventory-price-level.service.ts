import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryPriceLevelService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) { 
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  getInventoryPriceLevelByID(ID) {
    this.url = this.baseurl + 'api/INV/InventoryPriceLevel/GetInventoryPriceLevelByID/' + ID;
    return this.http.get(this.url);
  }
  addInventoryPriceLevel(data) {
    this.url = this.baseurl + 'api/INV/InventoryPriceLevel/AddInventoryPriceLevel';
    return this.http.post(this.url, data);
  }
  updateInventoryPriceLevel(data) {
    this.url = this.baseurl + 'api/INV/InventoryPriceLevel/UpdateInventoryPriceLevel';
    return this.http.post(this.url, data);
  }
  deleteInventoryPriceLevelByID(ID, DeletedBy) {
    this.url = this.baseurl + 'api/INV/InventoryPriceLevel/DeleteInventoryPriceLevelByID/' + ID + '/' + DeletedBy;
    return this.http.post(this.url, null);
  }

  getInventoryPriceLevel()
  {
    this.url = this.baseurl + 'api/INV/InventoryPriceLevel/GetAllInventoryPriceLevel';
    return this.http.get(this.url);
  }
}

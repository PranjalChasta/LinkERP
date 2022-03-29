import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryProductPriceService {

  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  addInventoryProductPrice(data) {
    this.url = this.baseurl + 'api/INV/InventoryProductPrice/InventoryProductPrice/AddInventoryProductPrice';
    return this.http.post(this.url, data);
  }
  updateInventoryProductPrice(data) {
    this.url = this.baseurl + 'api/INV/InventoryProductPrice/InventoryProductPrice/UpdateInventoryProductPrice';
    return this.http.post(this.url, data);
  }
  getInventoryProductPriceByID(ID) {
    
    this.url = this.baseurl + 'api/INV/InventoryProductPrice/InventoryProductPrice/GetInventoryProductPriceByID/' + ID;
    return this.http.get(this.url);
  }
  getInventoryProductPriceByInventryID(InventryID) {
    
    this.url = this.baseurl + 'api/INV/InventoryProductPrice/InventoryProductPrice/GetInventoryProductPriceByInventryID/' + InventryID;
    return this.http.get(this.url);
  }
}

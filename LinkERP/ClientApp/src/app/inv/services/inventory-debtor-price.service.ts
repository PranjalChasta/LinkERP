import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryDebtorPriceService {

  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  addInventoryDebtorPrice(data) {
    this.url = this.baseurl + 'api/INV/InventoryDebtorPrice/InventoryDebtorPrice/AddInventoryDebtorPrice';
    return this.http.post(this.url, data);
  }
  updateInventoryDebtorPrice(data) {
    this.url = this.baseurl + 'api/INV/InventoryDebtorPrice/InventoryDebtorPrice/UpdateInventoryDebtorPrice';
    return this.http.post(this.url, data);
  }
  getInventoryDebtorPriceByID(ID) { 
    this.url = this.baseurl + 'api/INV/InventoryDebtorPrice/InventoryDebtorPrice/GetInventoryDebtorPriceByID/' + ID;
    return this.http.get(this.url);
  }
  getInventoryDebtorPriceByInventoryID(InventryID) {
    
    this.url = this.baseurl + 'api/INV/InventoryDebtorPrice/InventoryDebtorPrice/GetInventoryDebtorPriceByInventoryID/' + InventryID;
    return this.http.get(this.url);
  }

  getCustomersDebtorPrice(InventryID,Actions) {
    this.url = this.baseurl + 'api/INV/InventoryDebtorPrice/InventoryDebtorPrice/GetCustomersDebtorPrice/' + InventryID + "/" + Actions;;
    return this.http.get(this.url);
  }
}

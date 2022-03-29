import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryWareHousePriceService {

  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  addInventoryWareHousePrice(data) {
    this.url = this.baseurl + 'api/INV/InventoryWareHouse_Price/InventoryWareHousePrice/AddInventoryWareHousePrice';
    return this.http.post(this.url, data);
  }
  updateInventoryWareHousePrice(data) {
    this.url = this.baseurl + 'api/INV/InventoryWareHouse_Price/InventoryWareHousePrice/UpdateInventoryWareHousePrice';
    return this.http.post(this.url, data);
  }
  getInventoryWareHousePriceByID(ID) { 
    this.url = this.baseurl + 'api/INV/InventoryWareHouse_Price/InventoryWareHousePrice/GetInventoryWareHousePriceByID/' + ID;
    return this.http.get(this.url);
  }
  getInventoryWareHouseByInventryID(InventryID,WareHouseID) { 
    this.url = this.baseurl + 'api/INV/InventoryWareHouse_Price/InventoryWareHousePrice/GetInventoryWareHousePriceByInventryID/' + InventryID + '/' + WareHouseID;
    return this.http.get(this.url);
     
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class WareHouseBinService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  getAllWareHouseBin() {
    this.url = this.baseurl + 'api/INV/Common/GetWareHouseBins';
    return this.http.get(this.url);
  }
  getWareHouseBinByID(ID) {
    this.url = this.baseurl + 'api/INV/WareHouseBin/GetWareHouseBinByID/' + ID;
    return this.http.get(this.url);
  }
  addWareHouseBin(data) {
    this.url = this.baseurl + 'api/INV/WareHouseBin/AddWareHouseBin';
    return this.http.post(this.url, data);
  }
  updateWareHouseBin(data) {
    this.url = this.baseurl + 'api/INV/WareHouseBin/UpdateWareHouseBin';
    return this.http.post(this.url, data);
  }
  deleteWareHouseBinByID(ID, LoginID) {
    this.url = this.baseurl + 'api/INV/WareHouseBin/DeleteWareHouseBinByID/' + ID + '/' + LoginID;
    return this.http.post(this.url, null);
  }

  getWareHouseBinByWareHouseID(ID) {
    this.url = this.baseurl + 'api/INV/WareHouseBin/GetWareHouseBinByWareHouseID/' + ID;
    return this.http.get(this.url);
  }
  AddUpdateWarehousebinDetails(data) {
    debugger;
    this.url = this.baseurl + 'api/INV/WareHouseBin/AddUpdateWareHouseBinData';
    return this.http.post(this.url, data);
  }
  checkwarehouseBin(ID, WarehouseID, CompanyID) {
    this.url = this.baseurl + 'api/INV/WareHouseBin/CheckWarehouseBin/' + ID + '/' + WarehouseID + '/' + CompanyID;
    return this.http.get(this.url);
  }
}

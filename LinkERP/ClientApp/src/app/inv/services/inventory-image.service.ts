import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryImageService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  getAllInventoryImage() {
    this.url = this.baseurl + 'api/INV/InventoryImage/InventoryImage/GetAllInventoryImages';
    return this.http.get(this.url);
  }
  addInventoryImage(data) {
    this.url = this.baseurl + 'api/INV/InventoryImage/InventoryImage/AddInventoryImage';
    return this.http.post(this.url, data);
  }
  updateInventoryImage(data) {
    this.url = this.baseurl + 'api/INV/InventoryImage/InventoryImage/UpdateInventoryImage';
    return this.http.post(this.url, data);
  }
  getInventoryImageByInventoryID(InventryID) {
    debugger;
    this.url = this.baseurl + 'api/INV/InventoryImage/InventoryImage/GetInventoryImageByInventryID/' + InventryID;
    return this.http.get(this.url);
  }
}

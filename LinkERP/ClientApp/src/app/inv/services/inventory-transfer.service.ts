import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/app-config.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InventoryTransferService {
  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
   }
   addInventoryTransfer(data) {
    this.url = this.baseurl + 'api/INV/InventoryTransfer/InventoryTransfer/AddInventoryTransfer';
    return this.http.post(this.url, data);
  }

  UpdateInventoryTransfer(data)
  {
    this.url = this.baseurl + 'api/INV/InventoryTransfer/InventoryTransfer/UpdateInventoryTransfer';
    return this.http.post(this.url, data);
  }
  getInventoryTransferByID(ID) {
    this.url = this.baseurl + 'api/INV/InventoryTransfer/InventoryTransfer/GetInventoryTransferByID/' + ID;
    return this.http.get(this.url);
  }
  GetInventoryTransfer()
  {
    this.url = this.baseurl + 'api/INV/InventoryTransfer/InventoryTransfer/GetAllInventoryTransfer';
    return this.http.get(this.url);
  }
}

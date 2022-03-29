import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryVendorService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) { 
    this.baseurl = appConfigService.getServiceBaseUrl();
  }

  addInventoryVendor(data) {
    this.url = this.baseurl + 'api/INV/InventoryVendor/InventoryVendor/AddInventoryVendor';
    return this.http.post(this.url, data);
  }

  UpdateInventoryVendor(data)
  {
    this.url = this.baseurl + 'api/INV/InventoryVendor/InventoryVendor/UpdateInventoryVendor';
    return this.http.post(this.url, data);
  }
  getInventoryVendorByID(ID) {
    
    this.url = this.baseurl + 'api/INV/InventoryVendor/InventoryVendor/GetInventoryVendorByID/' + ID;
    return this.http.get(this.url);
  }
  deleteInventoryVendorByID(ID, TableName, DeletedBy) {
    this.url = this.baseurl + 'api/SHARED/DeleteRecords/DeleteRecordsBYID/' + ID + '/' + TableName + '/' + DeletedBy;
    return this.http.post(this.url, null);
  }
}

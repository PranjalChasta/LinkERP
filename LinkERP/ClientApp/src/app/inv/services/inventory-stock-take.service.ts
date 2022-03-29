import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryStockTakeService {
  private url: string = "";
  private baseurl: string = "";


  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  } 
  getInventoryStockTake() {
    debugger;
    this.url = this.baseurl + 'api/INV/InventoryStockTake/InventoryStockTake/GetInventoryStockTake';
    return this.http.get(this.url);
  }
  addInventoryStockTake(data) {
    this.url = this.baseurl + 'api/INV/InventoryStockTake/InventoryStockTake/AddInventoryStockTake';
    return this.http.post(this.url, data);
  }

  updateInventoryStockTake(data) {
    this.url = this.baseurl + 'api/INV/InventoryStockTake/InventoryStockTake/UpdateInventoryStockTake';
    return this.http.post(this.url, data);
  }
  getInventoryStockTakeByID(ID) {
    this.url = this.baseurl + 'api/INV/InventoryStockTake/InventoryStockTake/GetInventoryStockTakeByID'+ ID;
    return this.http.get(this.url);
  }
  deleteInventoryStockTakeByID(ID, TableName, DeletedBy)
  {
     this.url = this.baseurl + 'api/SHARED/DeleteRecords/DeleteRecordsBYID/' + ID + '/' + TableName + '/' + DeletedBy;
     return this.http.post(this.url, null);
  } 
 
}

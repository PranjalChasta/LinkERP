import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryStockTakeDetailService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  getInventoryStockTakeDetail() {
    debugger;
    this.url = this.baseurl + 'api/INV/InventoryStockTakeDetail/InventoryStockTakeDetail/GetInventoryStockTakeDetail';
    return this.http.get(this.url);
  }
  addInventoryStockTakeDetail(data) {
    this.url = this.baseurl + 'api/INV/InventoryStockTakeDetail/InventoryStockTakeDetail/AddInventoryStockTakeDetail';
    return this.http.post(this.url, data);
  }

  updateInventoryStockTakeDetail(data) {
    this.url = this.baseurl + 'api/INV/InventoryStockTakeDetail/InventoryStockTakeDetail/UpdateInventoryStockTakeDetail';
    return this.http.post(this.url, data);
  }
  getInventoryStockTakeDetailByID(ID) {
    this.url = this.baseurl + 'api/INV/InventoryStockTakeDetail/InventoryStockTakeDetail/GetInventoryStockDetailTakeByID/'+ ID;
    return this.http.get(this.url);
  }
  getInventoryStockTakeDetailByStockTakeNo(StockTakeNo) {
    debugger;
    this.url = this.baseurl + 'api/INV/InventoryStockTakeDetail/InventoryStockTakeDetail/GetInventoryStockTakeDetailByStockTakeNo/'+ StockTakeNo;
    return this.http.get(this.url);
  }
  deleteInventoryStockTakeDetailByID(ID, TableName, DeletedBy)
  {
     this.url = this.baseurl + 'api/SHARED/DeleteRecords/DeleteRecordsBYID/' + ID + '/' + TableName + '/' + DeletedBy;
     return this.http.post(this.url, null);
  }
  UpdateInventoryStockTakeDetailList(data) {
    this.url = this.baseurl + 'api/INV/InventoryStockTakeDetail/InventoryStockTakeDetail/UpdateInventoryStockTakeDetailList';
    return this.http.post(this.url, data);
}

GetStockTakeProductMatrixByRecID(ProductID,StockTakeDetailID) { 
  this.url = this.baseurl + 'api/INV/InventoryStockTakeDetailProductStyleMatrix/InventoryStockTakeDetailProductStyleMatrix/GetStockTakeProductMatrixByRecID/' + ProductID+'/' + StockTakeDetailID;;
  return this.http.get(this.url);
}
}

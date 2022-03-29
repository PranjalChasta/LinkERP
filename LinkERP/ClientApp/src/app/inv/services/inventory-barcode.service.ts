import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryBarcodeService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
   }

   getInventoryBarCodeByID(ID) {    
    this.url = this.baseurl + 'api/INV/InventoryBarcode/InventoryBarcode/GetInventoryBarcodeByInventoryID/' + ID;
    return this.http.get(this.url);
  }

  AddInventoryDuplicateBarCode(data) {
    this.url = this.baseurl + 'api/INV/InventoryBarcode/InventoryBarcode/AddInventoryDuplicateBarCode';
    return this.http.post(this.url, data);
  }
  addInventoryBarCode(data) {
    this.url = this.baseurl + 'api/INV/InventoryBarcode/InventoryBarcode/AddInventoryBarCode';
    return this.http.post(this.url, data);
  }
  UpdateInventoryBarCode(data)
  {
    this.url = this.baseurl + 'api/INV/InventoryBarcode/InventoryBarcode/UpdateInventoryBarCode';
    return this.http.post(this.url, data);
  }
  deleteInventoryBarCodeByID(ID, TableName, DeletedBy)
   {
      this.url = this.baseurl + 'api/SHARED/DeleteRecords/DeleteRecordsBYID/' + ID + '/' + TableName + '/' + DeletedBy;
      return this.http.post(this.url, null);
   }
   AddUpdateMakeData(data){
    debugger;
    this.url = this.baseurl + 'api/INV/InventoryBarcode/InventoryBarcode/AddUpdateInvertoryBarcodeData';
    return this.http.post(this.url, data);
  }
  GetBarcodebyId(ID){
    this.url = this.baseurl + 'api/INV/InventoryBarcode/InventoryBarcode/GetInventoryBarcodeByID/' + ID;
    return this.http.get(this.url);
  }
}

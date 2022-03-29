import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private url: string = "";
  private baseurl: string = "";

 constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
 }
 getWareHouse(){
   
  this.url = this.baseurl + 'api/INV/Warehouse/GetWarehouses';
  return this.http.get(this.url);
 }
 addWareHouse(data) {
  
  this.url = this.baseurl + 'api/INV/Warehouse/AddWarehouse';
  return this.http.post(this.url, data);
}
updateWareHouse(data){
  this.url = this.baseurl + 'api/INV/Warehouse/UpdateWarehouse';
  return this.http.post(this.url, data);
}
deleteWareHouseByID(ID, LoginID)
  {
    
    this.url = this.baseurl + 'api/INV/Warehouse/DeleteWarehouseByID/' + ID + '/' + LoginID;
    return this.http.post(this.url, null);
  }
  getWareHouseByID(ID: any) {
    this.url = this.baseurl + 'api/INV/Warehouse/GetWarehouseByID/' + ID;
    return this.http.get(this.url);
  }
  updateProductWareHouse(data){
    this.url = this.baseurl + 'api/INV/Warehouse/UpdateProductWarehouse';
    return this.http.post(this.url, data);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class WarehouseNextNumberService {

  private url: string = "";
  private baseurl: string = "";

 constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
 }
 getWareHouseNumber(){
   
  this.url = this.baseurl + 'api/INV/WarehouseNextNumbers/GetWarehouseNextNumbers';
  return this.http.get(this.url);
 }
 addWareHouseNumber(data) {
  
  this.url = this.baseurl + 'api/INV/WarehouseNextNumbers/AddWarehouseNextNumber';
  return this.http.post(this.url, data);
}
updateWareHouseNumber(data){
  this.url = this.baseurl + 'api/INV/WarehouseNextNumbers/UpdateWarehouseNextNumber';
  return this.http.post(this.url, data);
}
deleteWareHouseNumberByID(ID, LoginID)
  {
    
    this.url = this.baseurl + 'api/INV/WarehouseNextNumbers/DeleteWarehouseNextNumbersByID/' + ID + '/' + LoginID;
    return this.http.post(this.url, null);
  }
  getWareHouseNumberByID(ID: any) {
    this.url = this.baseurl + 'api/INV/WarehouseNextNumbers/GetWarehouseNextNumbersByID/' + ID;
    return this.http.get(this.url);
  }
  getWareHouseNextNumberByWareHouseID(ID) {
    this.url = this.baseurl + 'api/INV/WarehouseNextNumbers/GetWareHouseNextNumberByWareHouseID/' + ID;
    return this.http.get(this.url);
  }

}

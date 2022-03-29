import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryUOMConversionService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  addInventoryUnitOfMeasure(data) {
    this.url = this.baseurl + 'api/INV/InventoryUnit_Of_MeasureConversions/InventoryUnitOfMeasureConversions/AddInventoryUnitOfMeasureConversion';
    return this.http.post(this.url, data);
  }
  updateInventoryUnitOfMeasure(data) {
    this.url = this.baseurl + 'api/INV/InventoryUnit_Of_MeasureConversions/InventoryUnitOfMeasureConversions/UpdateInventoryUnitOfMeasureConversion';
    return this.http.post(this.url, data);
  }
  getInventoryUnitOfMeasureByID(ID) {
    
    this.url = this.baseurl + 'api/INV/InventoryUnit_Of_MeasureConversions/InventoryUnitOfMeasureConversions/GetInventoryUnitOfMeasureConversionByID/' + ID;
    return this.http.get(this.url);
  }
  getInventoryUnitOfMeasureDetails(){
    this.url = this.baseurl + 'api/INV/InventoryUnit_Of_MeasureConversions/InventoryUnitOfMeasureConversions/GetInventoryUnitofMeasure';
    return this.http.get(this.url);
  }
}

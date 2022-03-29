import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/app-config.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InventoryAutomativeService {
  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) { 
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  addInventoryAutomotive(data) {
    this.url = this.baseurl + 'api/INV/InventoryAutomative/InventoryAutomative/AddInventoryAutomative';
    return this.http.post(this.url, data);
  }

  UpdateInventoryAutomotive(data)
  {
    this.url = this.baseurl + 'api/INV/InventoryAutomative/InventoryAutomative/UpdateInventoryAutomative';
    return this.http.post(this.url, data);
  }
  getInventoryAutomotiveByID(ID) {
    debugger;
    this.url = this.baseurl + 'api/INV/InventoryAutomative/InventoryAutomative/GetInventoryAutomativeByID/' + ID;
    return this.http.get(this.url);
  }

  getInventoryAutomativeByInventoryID(InventoryID) { 
    this.url = this.baseurl + 'api/INV/InventoryAutomative/InventoryAutomative/GetInventoryAutomativeByInventoryID/' + InventoryID;
    return this.http.get(this.url);
  }
  getMakeModel() { 
    this.url = this.baseurl + 'api/INV/InventoryAutomative/InventoryAutomative/GetMakeModel';
    return this.http.get(this.url);
  }
  getMakeModelByMakeID(MakeID) { 
    this.url = this.baseurl + 'api/INV/InventoryAutomative/InventoryAutomative/GetMakeModelByMakeID/' + MakeID;
    return this.http.get(this.url);
  }

  getSeriesByModelID(ModelID) { 
    this.url = this.baseurl + 'api/INV/InventoryAutomative/InventoryAutomative/GetSeriesByModelID/' + ModelID;
    return this.http.get(this.url);
  }

  getEngineBySeriesID(SeriesID) { 
    this.url = this.baseurl + 'api/INV/InventoryAutomative/InventoryAutomative/GetEngineBySeriesID/' + SeriesID;
    return this.http.get(this.url);
  }

}

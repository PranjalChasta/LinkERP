import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class PriceGroupsService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) { 
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  addPriceGroup(data) {
    
    this.url = this.baseurl + 'api/INV/PriceGroups/AddPriceGroup';
    return this.http.post(this.url, data);
  }
  updatePriceGroup(data) {
    this.url = this.baseurl + 'api/INV/PriceGroups/UpdatePriceGroup';
    return this.http.post(this.url, data);
  }
  deletePriceGroupByID(ID, DeletedBy) {
    this.url = this.baseurl + 'api/INV/PriceGroups/DeletePriceGroupByID/' + ID + '/' + DeletedBy;
    return this.http.post(this.url, null);
  }

  getPriceGrroup()
  {
    
    this.url = this.baseurl + 'api/INV/PriceGroups/GetPriceGroups';
    return this.http.get(this.url);
  }
  getPriceGroupByID(ID) {
    
    this.url = this.baseurl + 'api/INV/PriceGroups/GetPriceGroupByID/' + ID;
    return this.http.get(this.url);
  }

  getalltaxcode(){
    this.url = this.baseurl + 'api/INV/PriceGroups/GetTaxex';
    return this.http.get(this.url);
  }
}

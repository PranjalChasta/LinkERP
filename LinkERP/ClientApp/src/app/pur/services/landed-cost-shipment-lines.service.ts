import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class LandedCostShipmentLinesService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }

  //addLandedCostShipment(data) {
  //  this.url = this.baseurl + 'api/PUR/LandedCostShipmentLine/AddLandedCostShipment';
  //  return this.http.post(this.url, data);
  //}

  // addLandedCostShipment(data) {
  //   this.url = this.baseurl + 'api/PUR/LandedCostShipmentLine/AddLandedCostShipment';
  //   return this.http.post(this.url, data);
  // }
  // updateLandedCostShipment(data) {
  //   this.url = this.baseurl + 'api/PUR/LandedCostShipmentLine/UpdateLandedCostShipment';
  //   return this.http.post(this.url, data);
  // }
  getLandedCostShipment(CostID) {
    this.url = this.baseurl + 'api/PUR/LandedCostShipmentLine/GetLandedCostShipmentLines/' + CostID;
    return this.http.get(this.url);
  }
  submitShipmentOrder(data) {
    this.url = this.baseurl + 'api/PUR/LandedCostShipmentLine/SubmitLandedCostShipmentOrder';
    return this.http.post(this.url, data);
  }
}

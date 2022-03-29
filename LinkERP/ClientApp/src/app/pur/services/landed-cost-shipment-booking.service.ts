import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class LandedCostShipmentBookingService {
  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }

  getLandedCostShipmentBookingByCostID(CostID) {
    this.url = this.baseurl + 'api/PUR/LandedCostShipmentBooking/LandedCostShipmentBooking/GetLandedCostShipmentBookingCostID/' + CostID;
    return this.http.get(this.url);
  }

  addLandedCostShipmentBooking(data) {
    this.url = this.baseurl + 'api/PUR/LandedCostShipmentBooking/LandedCostShipmentBooking/AddLandedCostShipmentBooking';
    return this.http.post(this.url, data);
  }
  updateLandedCostShipmentBooking(data) {
    this.url = this.baseurl + 'api/PUR/LandedCostShipmentBooking/LandedCostShipmentBooking/UpdateLandedCostShipmentBooking';
    return this.http.post(this.url, data);
  }

  getLandedCostShipmentBookingByID(ID) {
    this.url = this.baseurl + 'api/PUR/LandedCostShipmentBooking/LandedCostShipmentBooking/GetLandedCostShipmentBookingByID/' + ID;
    return this.http.get(this.url);
  }
}

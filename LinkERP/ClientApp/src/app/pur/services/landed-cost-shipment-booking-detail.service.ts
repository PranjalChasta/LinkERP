import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class LandedCostShipmentBookingDetailService {
  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
   }
   addLandedCostShipmentBookingDetail(data) {
    debugger;
    this.url = this.baseurl + 'api/PUR/LandedCostShipmentBookingDetail/LandedCostShipmentBookingDetail/AddLandedCostShipmentBookingDetail';
    return this.http.post(this.url, data);
  }

  updateLandedCostShipmentBookingDetail(data) {
    this.url = this.baseurl + 'api/PUR/LandedCostShipmentBookingDetail/LandedCostShipmentBookingDetail/UpdateLandedCostShipmentBookingDetail';
    return this.http.post(this.url, data);
  }
  getLandedCostShipmentBookingDetailByID(ID) {
    debugger;
    this.url = this.baseurl + 'api/PUR/LandedCostShipmentBookingDetail/LandedCostShipmentBookingDetail/GetLandedCostShipmentBookingDetailByID/'+ ID;
    return this.http.get(this.url);
  }

  getLandedCostShipmentBookingDetailByshipmentID(ShipmentBookingDetaiID) {
    this.url = this.baseurl + 'api/PUR/LandedCostShipmentBookingDetail/LandedCostShipmentBookingDetail/GetLandedCostShipmentBookingDetailByShipmentBookingID/'+ ShipmentBookingDetaiID;
    return this.http.get(this.url);
  }
   
}

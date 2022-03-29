import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class LandedCostShipmentBookingProductStyleMatrixService {
  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
   }
   addLandedCostshipmentbookingProductstyleMatrix(data) {
    debugger;
    this.url = this.baseurl + 'api/PUR/LandedCostProductStyleMatrix/LandedCostShipmentBookingProductStyleMatrix/AddLandedCostShipmentBookingProductStyleMatrix';
    return this.http.post(this.url, data);
  }

  updateLandedCostshipmentbookingProductstyleMatrix(data) {
    this.url = this.baseurl + 'api/PUR/LandedCostProductStyleMatrix/LandedCostShipmentBookingProductStyleMatrix/UpdateLandedCostShipmentBookingProductStyleMatrix';
    return this.http.post(this.url, data);
  }
  getLandedCostshipmentbookingProductstyleMatrixByID(ID) {
    this.url = this.baseurl + 'api/PUR/LandedCostProductStyleMatrix/LandedCostShipmentBookingProductStyleMatrix/GetLandedCostShipmentBookingProductStyleMatrixByID/'+ ID;
    return this.http.get(this.url);
  }

  getLandedCostshipmentbookingProductstyleMatrixByshipmentID(ShipmentBookingDetaiID) {
    this.url = this.baseurl + 'api/PUR/LandedCostProductStyleMatrix/LandedCostShipmentBookingProductStyleMatrix/GetAllLandedCostShipmentBookingProductStyleMatrixByShippmentBookingID/'+ ShipmentBookingDetaiID;
    return this.http.get(this.url);
  }
}

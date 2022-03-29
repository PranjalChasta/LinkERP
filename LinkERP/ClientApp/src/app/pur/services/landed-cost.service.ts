import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class LandedCostService {
  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
   }
  //  getNextShipmentNumber(){
  //   this.url = this.baseurl + 'api/PUR/LandedCost/LandedCost/GetNextShipmentNumber';
  //   return this.http.get(this.url);
  //  }
   getLandedCost() {
    debugger;
    this.url = this.baseurl + 'api/PUR/LandedCost/LandedCost/GetAllLandedCost';
    return this.http.get(this.url);
  }
  addLandedCost(data) {
    debugger;
    this.url = this.baseurl + 'api/PUR/LandedCost/LandedCost/AddLandedCost';
    return this.http.post(this.url, data);
  }

  updateLandedCost(data) {
    this.url = this.baseurl + 'api/PUR/LandedCost/LandedCost/UpdateLandedCost';
    return this.http.post(this.url, data);
  }
  getLandedCostByID(ID) {
    this.url = this.baseurl + 'api/PUR/LandedCost/LandedCost/GetLandedCostByID/'+ ID;
    return this.http.get(this.url);
  }

  getLandedCostPurchaseOrderByCostID(CostID) {
    this.url = this.baseurl + 'api/PUR/LandedCostPurchaseOrder/LandedCostPurchaseOrder/GetLandedCostPurchaseOrderByCostID/'+ CostID;
    return this.http.get(this.url);
  }

  addLandedCostPurchaseOrder(data) {
    debugger;
    this.url = this.baseurl + 'api/PUR/LandedCostPurchaseOrder/LandedCostPurchaseOrder/AddLandedCostPurchaseOrder';
    return this.http.post(this.url, data);
  }
  updateLandedCostPurchaseOrder(data) {
    this.url = this.baseurl + 'api/PUR/LandedCostPurchaseOrder/LandedCostPurchaseOrder/UpdateLandedCostPurchaseOrder';
    return this.http.post(this.url, data);
  }

  getLandedCostOrderByID(ID) {
    this.url = this.baseurl + 'api/PUR/LandedCostPurchaseOrder/LandedCostPurchaseOrder/GetLandedCostPurchaseOrderByID/'+ ID;
    return this.http.get(this.url);
  }
  getPurchaseOrder(PurchaseLandedCostID,WarehouseID){
    this.url = this.baseurl + 'api/PUR/LandedCostPurchaseOrder/LandedCostPurchaseOrder/GetLandedCostPurchaseOrder/'+PurchaseLandedCostID+'/'+WarehouseID;
    return this.http.get(this.url);
  }
  submitLandedCostPurchaseOrder(data) {
    this.url = this.baseurl + 'api/PUR/LandedCostPurchaseOrder/LandedCostPurchaseOrder/SubmitLandedCostPurchaseOrder';
    return this.http.post(this.url, data);
  }

  deletePurchaseOrder(PurchaseID,PurchaseLandedCostID){
    this.url = this.baseurl + 'api/PUR/LandedCostPurchaseOrder/LandedCostPurchaseOrder/DeleteLandedCostPurchaseOrder/'+PurchaseID+'/'+PurchaseLandedCostID;
    return this.http.post(this.url, null);
  }
}

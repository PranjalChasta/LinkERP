import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class KitchenviewService {

  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  getTables() {

    this.url = this.baseurl + 'api/KitchenView/Table/GetTables';
    return this.http.get(this.url);
  }
  addTable(data) {

    this.url = this.baseurl + 'api/KitchenView/Table/AddTable';
    return this.http.post(this.url, data);
  }
  updateTable(data) {
    this.url = this.baseurl + 'api/KitchenView/Table/UpdateTable';
    return this.http.post(this.url, data);
  }
  deleteTableByID(ID, LoginID) {
    this.url = this.baseurl + 'api/KitchenView/Table/DeleteTableByID/' + ID + '/' + LoginID;
    return this.http.post(this.url, null);
  }
  getTableByID(ID: any) {
    this.url = this.baseurl + 'api/KitchenView/Table/GetTableByID/' + ID;
    return this.http.get(this.url);
  }

  getReservationsByTableID(tableID) {

    this.url = this.baseurl + 'api/KitchenView/Reservation/GetReservations/' + tableID;
    return this.http.get(this.url);
  }
  addReservation(data) {

    this.url = this.baseurl + 'api/KitchenView/Reservation/AddReservation';
    return this.http.post(this.url, data);
  }
  updateReservation(data) {
    this.url = this.baseurl + 'api/KitchenView/Reservation/UpdateReservation';
    return this.http.post(this.url, data);
  }
  deleteReservationByID(ID, LoginID) {

    this.url = this.baseurl + 'api/KitchenView/Reservation/DeleteReservationByID/' + ID + '/' + LoginID;
    return this.http.post(this.url, null);
  }
  getReservationByID(ID: any) {
    this.url = this.baseurl + 'api/KitchenView/Reservation/GetReservationByID/' + ID;
    return this.http.get(this.url);
  }
  getKitchenProcessingView(){
    this.url = this.baseurl + 'api/KitchenView/KitchenProcessingView/GetKitchenProcessingView';
    return this.http.get(this.url);
  }
  getReadyOrders() {
    this.url = this.baseurl + 'api/KitchenView/KitchenProcessingView/GetReadyOrder';
    return this.http.get(this.url);
  }
  getNewOrders() {
    this.url = this.baseurl + 'api/KitchenView/KitchenProcessingView/GetNewOrders';
    return this.http.get(this.url);
  }
  getProgressOrders() {
    this.url = this.baseurl + 'api/KitchenView/KitchenProcessingView/GetProgressOrders';
    return this.http.get(this.url);
  }
}

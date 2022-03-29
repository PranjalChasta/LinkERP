import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class RequisitionDetailsService {
  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  getRequisitionDetails() {
    debugger;
    this.url = this.baseurl + 'api/PUR/RequisitionDetails/RequisitionDetails/GetRequisitionDetails/';
    return this.http.get(this.url);
  }
  getRequisitionDetailsByRequisitionID(RequisitionID) {
    debugger;
    this.url = this.baseurl + 'api/PUR/RequisitionDetails/RequisitionDetails/GetRequisitionDetailsByRequisitionID/'+ RequisitionID;
    return this.http.get(this.url);
  }
  addRequisitionDetails(data) {
    debugger;
    this.url = this.baseurl + 'api/PUR/RequisitionDetails/RequisitionDetails/AddRequisitionDetails';
    return this.http.post(this.url, data);
  }

  updateRequisitionDetails(data) {
    this.url = this.baseurl + 'api/PUR/RequisitionDetails/RequisitionDetails/UpdateRequisitionDetails';
    return this.http.post(this.url, data);
  } 
  getRequisitionDetailsByID(ID) {
    this.url = this.baseurl + 'api/PUR/RequisitionDetails/RequisitionDetails/GetRequisitionDetailsByID/'+ ID;
    return this.http.get(this.url);
  }

  updateRequisitionDetailStatus(data) {
    this.url = this.baseurl + 'api/PUR/RequisitionDetails/RequisitionDetails/UpdateRequisitionDetailStatus';
    return this.http.post(this.url, data);
  }
  getProductMatrixByRecID(ProductID,RequisitionID,RequisitionDetailID) {
    this.url = this.baseurl + 'api/PUR/RequisitionDetails/RequisitionDetails/GetProductMatrixByRecID/' + ProductID+'/'+RequisitionID+'/'+RequisitionDetailID;
    return this.http.get(this.url);
  }
  bindProductByVenderid(VenderId,CompanyId) {
    this.url = this.baseurl + 'api/PUR/RequisitionDetails/RequisitionDetails/BindProductByVenderid/' + VenderId+'/'+CompanyId;
    return this.http.get(this.url);
  }

  updateRequisitionDetailsProductStyleMatrixList(data) {
    this.url = this.baseurl + 'api/PUR/RequisitionDetailsProductStyleMatrix/RequisitionDetailsProductStyleMatrix/UpdateRequisitionDetailsProductStyleMatrixList';
    return this.http.post(this.url, data);
}

updateInventoryAdjustmentProductStyleMatrixList(data) {
  this.url = this.baseurl + 'api/PUR/RequisitionDetails/RequisitionDetails/UpdateRequisitionDetailsProductStyleMatrixList';
  return this.http.post(this.url, data);
}

getActiveRequisitionDetailsByRequisitionID(RequisitionID) {
  debugger;
  this.url = this.baseurl + 'api/PUR/RequisitionDetails/RequisitionDetails/GetActiveRequisitionDetailsByRequisitionID/'+ RequisitionID;
  return this.http.get(this.url);
}
}

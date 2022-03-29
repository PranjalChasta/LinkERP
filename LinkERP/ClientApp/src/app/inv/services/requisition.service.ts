import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class RequisitionService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) { 
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  getrequisitions() {
    debugger;
    this.url = this.baseurl + 'api/PUR/Requisition/Requisition/GetRequisition';
    return this.http.get(this.url);
  }
  getvendors(){
    this.url = this.baseurl + 'api/PUR/Vendor/GetVendors';
    return this.http.get(this.url);
  }
  getStatus(){
    this.url = this.baseurl + 'api/PUR/Vendor/GetRequisitionStatus';
    return this.http.get(this.url);
  }
  addRequisition(data) {
    debugger;
    this.url = this.baseurl + 'api/PUR/Requisition/Requisition/AddRequisition';
    return this.http.post(this.url, data);
  }

  updateRequisition(data) {
    this.url = this.baseurl + 'api/PUR/Requisition/Requisition/UpdateRequisition';
    return this.http.post(this.url, data);
  }
  getRequisitionByID(ID) {
    this.url = this.baseurl + 'api/PUR/Requisition/Requisition/GetRequisitionByID/'+ ID;
    return this.http.get(this.url);
  }

  getNextApprover(RequestedBy,CurrentApprover,ApprovalFlowCode,Amount) {
    this.url = this.baseurl + 'api/PUR/Requisition/Requisition/GetNextApprover/'+ RequestedBy+ '/' + CurrentApprover+ '/' + ApprovalFlowCode+ '/' + Amount;;
    return this.http.get(this.url);
  }
  getRequestApproval(LoginID) {
    this.url = this.baseurl + 'api/PUR/Requisition/Requisition/GetRequestApproval/' + LoginID;
    return this.http.get(this.url);
  }
  getOrderApproval(LoginID) {
    this.url = this.baseurl + 'api/PUR/Requisition/Requisition/GetOrderApproval/' + LoginID;
    return this.http.get(this.url);
  }
}

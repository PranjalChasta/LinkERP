import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class InternalTransfersService {
  private url: string = "";
  private baseurl: string = "";
 constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
 } 
 getInternalTransfer() { 
  this.url = this.baseurl + 'api/PUR/InternalTransfers/InternalTransfers/GetInternalTransfers';
  return this.http.get(this.url);
}

addInternalTransfer(data) { 
  this.url = this.baseurl + 'api/PUR/InternalTransfers/InternalTransfers/AddInternalTransfers';
  return this.http.post(this.url, data);
}

updateInternalTransfer(data) {
  this.url = this.baseurl + 'api/PUR/InternalTransfers/InternalTransfers/UpdateInternalTransfers';
  return this.http.post(this.url, data);
}
getInternalTransferByID(ID) {
  this.url = this.baseurl + 'api/PUR/InternalTransfers/InternalTransfers/GetInternalTransfersByID/'+ ID;
  return this.http.get(this.url);
}
getRequisitionDetailsByCompanyID(CompanyID) {
  this.url = this.baseurl + 'api/PUR/InternalTransfers/InternalTransfers/GetRequisitionDetailsByCompanyID/'+ CompanyID;
  return this.http.get(this.url);
}
updateInventoryPURInternalTransfersList(data) {
  this.url = this.baseurl + 'api/PUR/InternalTransfers/InternalTransfers/UpdateInventoryPURInternalTransfersList';
  return this.http.post(this.url, data);
}

getInternalTransferByBatchNumber(BatchNumber) {
  this.url = this.baseurl + 'api/PUR/InternalTransfers/InternalTransfers/GetInternalTransferByBatchNumber/'+ BatchNumber;
  return this.http.get(this.url);
}
initiateTransfer(BatchNumber,CreatedBY,CompanyID) {
  this.url = this.baseurl + 'api/PUR/InternalTransfers/InternalTransfers/InitiateTransfer/' + BatchNumber + '/' + CreatedBY+'/' + CompanyID;
  return this.http.post(this.url, null);
}
getPurchaseRequisitionNumbers() {
  this.url = this.baseurl + 'api/PUR/InternalTransfers/InternalTransfers/GetPurchaseRequisitionNumbers'
  return this.http.get(this.url);
}
RequistionDetailList(data) {
  this.url = this.baseurl + 'api/PUR/InternalTransfers/InternalTransfers/RequistionDetailList';
  return this.http.post(this.url, data);
}
GetPurchaseRequisitionNumbers(BatchID) { 
  this.url = this.baseurl + 'api/PUR/InternalTransfersDetail/InternalTransfersDetail/GetPurchaseRequisitionNumbers/'+BatchID;
  return this.http.get(this.url);
}

InternalTransfersDetailsList(data) {
  this.url = this.baseurl + 'api/PUR/InternalTransfersDetail/InternalTransfersDetail/InternalTransfersDetailsList';
  return this.http.post(this.url, data);
}
}

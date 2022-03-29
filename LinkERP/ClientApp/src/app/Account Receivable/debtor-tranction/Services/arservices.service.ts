import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ARServicesService {
    private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl(); 
  }
  getAllReceipt() {
    debugger;
    this.url = this.baseurl + 'api/ACR/DeborReceipt/GetAllReceipts';
    return this.http.get(this.url);
  }
  AddReceiptMain(data)
  {
    debugger;
    this.url = this.baseurl + 'api/ACR/DeborReceipt/AddReceiptMain';
    return this.http.post(this.url, data);
  }
  UpdateReceptMain(data)
  {
    debugger;
    this.url = this.baseurl + 'api/ACR/DeborReceipt/UpdateReceiptMain';
    return this.http.post(this.url, data);
  }
  AddReceiptDetail(data)
  {
    debugger;
    this.url = this.baseurl + 'api/ACR/DeborReceipt/AddReceiptDetail';
    return this.http.post(this.url, data);
  }
  getReceiptMainByid(ReceiptMainID) {
    debugger;
    this.url = this.baseurl + 'api/ACR/DeborReceipt/GetReceptMainByID/'+ ReceiptMainID;
    return this.http.get(this.url);
  }
  getDetailbyid(ReceiptMainID) {
    debugger;
    this.url = this.baseurl + 'api/ACR/DeborReceipt/GetReceiptsDetailByID/'+ ReceiptMainID;
    return this.http.get(this.url);
  }
  AddReceiptAllocation(data)
  {
    debugger;
    this.url = this.baseurl + 'api/ACR/DeborReceipt/AddReceiptAllocationDetail';
    return this.http.post(this.url, data);
  }
  getprevioustranction(ReceptID) {
    debugger;
    this.url = this.baseurl + 'api/ACR/DeborReceipt/GetPreviousAllocation/'+ ReceptID;
    return this.http.get(this.url);
  }

  //Refund 

  getAllRefaund() {
    debugger;
    this.url = this.baseurl + 'api/ACR/DebtorRefund/GetAllRefaund';
    return this.http.get(this.url);
  }

  AddRefundMainDetail(data) {
    debugger;
    this.url = this.baseurl + 'api/ACR/DebtorRefund/AddRefundMainDetail';
    return this.http.post(this.url, data);
  }
  getRefundMainByid(RefundMainID) {
    debugger;                          
    this.url = this.baseurl + 'api/ACR/DebtorRefund/GetRefundMainByID/'+ RefundMainID;
    return this.http.get(this.url);
  }
  getRefundDetailbyid(RefundMainID) {
    debugger;
    this.url = this.baseurl + 'api/ACR/DebtorRefund/GetRefundDetailByID/'+ RefundMainID;
    return this.http.get(this.url);
  }
  getRefundallocation(DebtorID) {
    debugger;
    this.url = this.baseurl + 'api/ACR/DebtorRefund/GetRefundAllocationByID/'+ DebtorID;
    return this.http.get(this.url);
  }
  AddRRefundAllocation(data)
  {
    debugger;
    this.url = this.baseurl + 'api/ACR/DebtorRefund/AddRefundAllocationDetail';
    return this.http.post(this.url, data);
  }
  //--------------------------------Adjustmenet-----------------------------------------------
  AddUpdateAdjustment(data) {
    debugger;
    this.url = this.baseurl + 'api/ACR/DebtorAdjustment/AddUpdateDebtorAdjustment';
    return this.http.post(this.url, data);
  }
  getAllAdjustment() {
    debugger;
    this.url = this.baseurl + 'api/ACR/DebtorAdjustment/GetAllAdjustment';
    return this.http.get(this.url);
  }
  getAllAdjustments() {
    debugger;
    this.url = this.baseurl + 'api/ACR/DebtorAdjustment/GetAllAdjustments';
    return this.http.get(this.url);
  }
  getAdjustmentMainid(DBAdjustmentMainID) {
    debugger;
    this.url = this.baseurl + 'api/ACR/DebtorAdjustment/GetAdjustmentMainByID/'+ DBAdjustmentMainID;
    return this.http.get(this.url);
  }
  getAdjustmentDetailbyid(DBAdjustmentMainID) {
    debugger;
    this.url = this.baseurl + 'api/ACR/DebtorAdjustment/GetAdjustmentDetailsByID/'+ DBAdjustmentMainID;
    return this.http.get(this.url);
  }

}

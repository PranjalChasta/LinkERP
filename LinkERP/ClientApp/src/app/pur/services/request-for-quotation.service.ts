import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class RequestForQuotationService {

  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  getApprovedRequisitions() {
    this.url = this.baseurl + 'api/PUR/RequestForQuotation/RequestForQuotation/GetApprovedRequisition';
    return this.http.get(this.url);
  }
  getProductForVendorPrice(VendorID, RequisitionID) {
    debugger;
    this.url = this.baseurl + 'api/PUR/RequestForQuotation/RequestForQuotation/GetVendorQuotePrice/' + VendorID + '/' + RequisitionID;
    return this.http.get(this.url);
  }
  getVendorComparisionPrice(ProductID, RequisitionID) {
    this.url = this.baseurl + 'api/PUR/RequestForQuotation/RequestForQuotation/GetPreferredVendorList/' + ProductID + '/' + RequisitionID;
    return this.http.get(this.url);
  }
  SubmitRequestForQuoteAnalysis(data) {
    this.url = this.baseurl + 'api/PUR/RequestForQuotation/RequestForQuotation/SubmitRequestForQuoteAnalysis';
    return this.http.post(this.url, data);
  }
  UpdateQuoteAnalysisData(data) {
    this.url = this.baseurl + 'api/PUR/RequestForQuotation/RequestForQuotation/UpdateQuoteAnalysis';
    return this.http.post(this.url, data);
  }
  getVendorList() {
    this.url = this.baseurl + 'api/PUR/RequestForQuotation/RequestForQuotation/GetVendorList';
    return this.http.get(this.url);
  }
  getProductList() {
    this.url = this.baseurl + 'api/PUR/RequestForQuotation/RequestForQuotation/GetProductList';
    return this.http.get(this.url);
  }
  getVendorListByRequisitionID(VendorID) {
    this.url = this.baseurl + 'api/PUR/RequestForQuotation/RequestForQuotation/GetVendorListForQuotation/' + VendorID;
    return this.http.get(this.url);
  }
  getProductsByRequisitionID(ProductID) {
    this.url = this.baseurl + 'api/PUR/RequestForQuotation/RequestForQuotation/GetProductListForQuotation/' + ProductID;
    return this.http.get(this.url);
  }

  updatePURRequisitionPOList(data) {
    this.url = this.baseurl + 'api/PUR/RequestForQuotation/RequestForQuotation/updatePURRequisitionPOList';
    return this.http.post(this.url, data);
  }

  getRequisitionConvertToPO() {
    this.url = this.baseurl + 'api/PUR/RequestForQuotation/RequestForQuotation/GetRequisitionConvertToPO';
    return this.http.get(this.url);
  }
}

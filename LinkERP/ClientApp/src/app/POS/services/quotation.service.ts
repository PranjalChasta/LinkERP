import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/app-config.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {

  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }

  GetQuotationList() {
    this.url = this.baseurl + 'api/POS/QuotationMain/GetAllQuotationMains';
    return this.http.get(this.url);
  }

  AddQuotation(data) {
    this.url = this.baseurl + 'api/POS/QuotationMain/AddQuotationMain';
    return this.http.post(this.url, data);
  }
  ConvertQuotationToSalesOrder(ID) {
    debugger;
    this.url = this.baseurl + 'api/POS/QuotationMain/ConvertQuotationToSalesOrder/' + ID;
    return this.http.post(this.url, null);
  }
  CloseQuotation(ID) {
    
    this.url = this.baseurl + 'api/POS/QuotationMain/CloseQuotation/' + ID;
    return this.http.post(this.url, null);
  }
  UpdateQuotation(data) {
    this.url = this.baseurl + 'api/POS/QuotationMain/UpdateQuotationMain';
    return this.http.post(this.url, data);
  }

  deleteRecordsBYID(ID, TableName, DeletedBy) {
    this.url = this.baseurl + 'api/SHARED/DeleteRecords/DeleteRecordsBYID/' + ID + '/' + TableName + '/' + DeletedBy;
    return this.http.post(this.url, null);
  }
  getDebtorDetails(DebtorId) {
    this.url = this.baseurl + 'api/POS/QuotationMain/GetDebtorDetails/' + DebtorId;
    return this.http.get(this.url);
  }
  GetQuotationStatusAndReason() {
    this.url = this.baseurl + 'api/POS/QuotationMain/GetQuotationStatus';
    return this.http.get(this.url);
  }

  getTaxCode() {
    this.url = this.baseurl + 'api/PUR/LandedCostImportCost/GetTaxDetails';
    return this.http.get(this.url);
  }
  GetInventoryDetail(WarehouseID) {
    this.url = this.baseurl + 'api/POS/QuotationDetail/GetInventoryDetails/' + WarehouseID;
    return this.http.get(this.url);
  }
  GetAllQuotationDetails(QuotationID) {
    this.url = this.baseurl + 'api/POS/QuotationDetail/GetAllQuotationDetails/' + QuotationID;
    return this.http.get(this.url);
  }
  deleteQuotationDetailByID(ID, TableName, DeletedBy) {
    this.url = this.baseurl + 'api/SHARED/DeleteRecords/DeleteRecordsBYID/' + ID + '/' + TableName + '/' + DeletedBy;
    return this.http.post(this.url, null);
  }
  submitQuotationDetails(data) {
    debugger;
    this.url = this.baseurl + 'api/POS/QuotationDetail/AddQuotationDetail';
    return this.http.post(this.url, data);
  }
  updateQuotationDetails(data) {
    this.url = this.baseurl + 'api/POS/QuotationDetail/UpdateQuotationDetail';
    return this.http.post(this.url, data);
  }
  //To get Tax Labels after selection of tax
  gettaxLabelBytaxId(TaxID, LoginID) {
    this.url = this.baseurl + 'api/POS/QuotationDetailTaxLabels/GetTaxLabelDetailByTaxID/' + TaxID + '/' + LoginID;
    return this.http.get(this.url);
  }
  //Get QuotationDetails Tax Label List
  getQuotationDetailsTaxLabel() {
    this.url = this.baseurl + 'api/POS/QuotationDetailTaxLabels/GetAllQuotationDetailTaxLabels';
    return this.http.get(this.url);
  }

  //Add Quotation Details tax label 
  addQuotationDetailTaxLabel(data) {
    this.url = this.baseurl + 'api/POS/QuotationDetailTaxLabels/AddQuotationDetailTaxLabels';
    return this.http.post(this.url, data);
  }
  sendEmail(data) {
    this.url = this.baseurl + 'api/POS/QuotationMain/SendMail';
    return this.http.post(this.url, data);
  }
}

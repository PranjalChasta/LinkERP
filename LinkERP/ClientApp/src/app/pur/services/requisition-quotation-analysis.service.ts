import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class RequisitionQuotationAnalysisService {

  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  getrequisitionquotationanalysis() {
    debugger;
    this.url = this.baseurl + 'api/PUR/RequitionQuotationAnalysis/RequitionQuotationAnalysis/GetRequitionQuotationAnalysis';
    return this.http.get(this.url);
  }
  getvendors(){
    this.url = this.baseurl + 'api/PUR/Vendor/GetVendors';
    return this.http.get(this.url);
  }

  addRequisitionquotationanalysis(data) {
    debugger;
    this.url = this.baseurl + 'api/PUR/RequitionQuotationAnalysis/RequitionQuotationAnalysis/AddRequitionQuotationAnalysis';
    return this.http.post(this.url, data);
  }

  updateRequisitionquotationanalysis(data) {
    this.url = this.baseurl + 'api/PUR/RequitionQuotationAnalysis/RequitionQuotationAnalysis/UpdateRequitionQuotationAnalysis';
    return this.http.post(this.url, data);
  }
  getRequisitionquotationanalysisByID(ID) {
    this.url = this.baseurl + 'api/PUR/RequitionQuotationAnalysis/RequitionQuotationAnalysis/GetRequitionQuotationAnalysisByID/'+ ID;
    return this.http.get(this.url);
  }
}

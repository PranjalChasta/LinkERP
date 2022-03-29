import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class PriceWorkflowService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  GetAvailablePriceWorkflow(companyID) {
    this.url = this.baseurl + 'api/POS/PriceWorkflow/GetAvailablePriceWorkflow/' + companyID;
    return this.http.get(this.url);
  }
  SavePriceWorkflow(data) {
    this.url = this.baseurl + 'api/POS/PriceWorkflow/SavePriceWorkflow';
    return this.http.post(this.url, data);
  }

  GetUsedPriceWorkflow(companyID) {
    this.url = this.baseurl + 'api/POS/PriceWorkflow/GetUsedPriceWorkflow/' + companyID;
    return this.http.get(this.url);
  }
  SaveUsedPriceWorkflow(data, companyID) {
    this.url = this.baseurl + 'api/POS/PriceWorkflow/SaveUsedPriceWorkflow/' + companyID;
    return this.http.post(this.url, data);
  }

  GetPriceWorkflowsByCompany(companyID) {
    this.url = this.baseurl + 'api/POS/PriceWorkflow/GetPriceWorkflowsByCompany/' + companyID;
    return this.http.get(this.url);
  }

  GetAvailablePriceWorkflows(companyID, action, priceWorkFlowID) {
    this.url = this.baseurl + 'api/POS/PriceWorkflow/GetPriceWorkflows?companyID=' + companyID + '&priceWorkFlowID=' + priceWorkFlowID + '&action=' + action + '';
    return this.http.get(this.url);
  }
  SavePriceWorkflows(data, companyID) {
    this.url = this.baseurl + 'api/POS/PriceWorkflow/SavePriceWorkflows/' + companyID;
    return this.http.post(this.url, data);
  }
}

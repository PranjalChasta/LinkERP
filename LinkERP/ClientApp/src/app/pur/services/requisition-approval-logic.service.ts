import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class RequisitionApprovalLogicService {

  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  getRequisitionApprovalLogicDetailsByRequisitionID(RequisitionID) {
    this.url = this.baseurl + 'api/PUR/RequisitionApprovalLogs/RequisitionApprovalLogs/GetRequisitionApprovalLogs/'+ RequisitionID;
    return this.http.get(this.url);
  }
}

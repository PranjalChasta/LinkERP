import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class WorkflowApproversService {
  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  getAllWorkflowApprovers() {
    this.url = this.baseurl + 'api/SYS/WorkFlowApprovers/GetAllWorkflowApprovers';
    return this.http.get(this.url);
  }
  addWorkflowApprovers(data) {
    this.url = this.baseurl + 'api/SYS/WorkFlowApprovers/AddWorkFlowApprover';
    return this.http.post(this.url, data);
  }
  getWorkflowApproversByID(ID) {
    this.url = this.baseurl + 'api/SYS/WorkFlowApprovers/GetWorkflowApproversByID/' + ID;
    return this.http.get(this.url);
  }
  updateWorkflowApprovers(data) {
    this.url = this.baseurl + 'api/SYS/WorkFlowApprovers/UpdateWorkFlowApprover';
    return this.http.post(this.url, data);
  }
  getWorkflowApproversByWorkflowID(ID) {
    this.url = this.baseurl + 'api/SYS/WorkFlowApprovers/GetWorkflowApproversByWorkflowID/' + ID;
    return this.http.get(this.url);
  }
  getLoginUsersforworkflowApprovers(ID, LoginID) {
    this.url = this.baseurl + 'api/SYS/WorkFlowApprovers/GetLoginUsersforworkflowApprovers/' + ID + '/' + LoginID;
    return this.http.get(this.url);
  }
}

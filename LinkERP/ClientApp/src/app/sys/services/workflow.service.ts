import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';


@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private url: string = "";
  private baseUrl: string = "";
  constructor(
    public http: HttpClient,
    private appconfigService: AppConfigService) {
    this.baseUrl = appconfigService.getServiceBaseUrl();
  }
  getAllWorkFlows() {
    this.url = this.baseUrl + 'api/SYS/WorkFlow/GetAllWorkFlows';
    return this.http.get(this.url);
  }
  addWorkFlow(data) {
    this.url = this.baseUrl + 'api/SYS/WorkFlow/AddWorkFlow';
    return this.http.post(this.url, data);
  }
  updateWorkFlow(data) {
    this.url = this.baseUrl + 'api/SYS/WorkFlow/UpdateWorkFlow';
    return this.http.post(this.url, data);
  }
  getWorkFlowByID(ID) {
    this.url = this.baseUrl + 'api/SYS/WorkFlow/GetWorkFlowByID/' + ID;
    return this.http.get(this.url);
  }
  deleteWorkFlowByID(ID,DeletedBy) {
    this.url = this.baseUrl + 'api/SYS/WorkFlow/DeleteWorkFlowByID/' + ID + '/' + DeletedBy;
   // this.url = this.baseUrl + 'api/SYS/WorkFlow/DeleteWorkFlowByID?ID=' + ID + '&DeletedBy=' + DeletedBy;
 
    return this.http.post(this.url,null);
  }
  updateWorkFlowDetails(data){
    debugger;
    this.url = this.baseUrl + 'api/SYS/WorkFlow/AddUpdateWorkFlowData';
    return this.http.post(this.url, data);
  }
}

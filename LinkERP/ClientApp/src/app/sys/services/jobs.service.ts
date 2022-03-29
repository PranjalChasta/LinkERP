import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  private url: string = "";
  private baseUrl: string = "";

  constructor(public http: HttpClient, private appCongfigService: AppConfigService) {
    this.baseUrl = appCongfigService.getServiceBaseUrl();
  }
  getjobs() {
    
    this.url = this.baseUrl + 'api/SYS/Job/GetJobs';
    return this.http.get(this.url);
  }
  addJob(data) {
    
    this.url = this.baseUrl + 'api/SYS/Job/AddJob';
    return this.http.post(this.url, data);
  }
  updateJob(data){
    this.url = this.baseUrl + 'api/SYS/Job/UpdateJob';
    return this.http.post(this.url, data);
  }
  getJobByID(ID: any) {
    this.url = this.baseUrl + 'api/SYS/Job/GetJobByID/' + ID;
    return this.http.get(this.url);
  }
 
  deleteJobByID(ID, LoginID) {
    
    this.url = this.baseUrl + 'api/SYS/Job/DeleteJobByID/' + ID + '/' + LoginID;
    return this.http.post(this.url, null);
  }
getDocumentByCompanyID(CompanyID:any){
  
  this.url = this.baseUrl + 'api/SYS/DocumentTemplate/GetDocumentByCompanyID/' + CompanyID ;
  return this.http.get(this.url);
}
getFrequencyByCompanyID(CompanyID:any){
  
  this.url = this.baseUrl + 'api/SYS/Frequency/GetFrequencyByCompanyID/' + CompanyID ;
  return this.http.get(this.url);
}
getModules(){
  
  this.url = this.baseUrl + 'api/SYS/Module/GetModules';
  return this.http.get(this.url);
}
}

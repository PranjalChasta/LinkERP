import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';


@Injectable({
  providedIn: 'root'
})
export class ReportScheduleService {

  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }

  getReportSchedules() {
    this.url = this.baseurl + 'api/SYS/ReportSchedule/GetReportSchedules';
    return this.http.get(this.url);
  }

  addReportSchedule(data) {
    debugger;
    this.url = this.baseurl + 'api/SYS/ReportSchedule/AddReportSchedule';
    return this.http.post(this.url, data);
  }
  updateReportSchedule(data) {
    this.url = this.baseurl + 'api/SYS/ReportSchedule/UpdateReportSchedule';
    return this.http.post(this.url, data);
  }
  getReportsSchedulesByID(ID) {
    this.url = this.baseurl + 'api/SYS/ReportSchedule/GetReportsScheduleByID/' + ID;
    return this.http.get(this.url);
  }
  BackupDB(data) {
    debugger;
    this.url = this.baseurl + 'api/SYS/ReportSchedule/BackupDatabase';
    return this.http.post(this.url,data);
  }
}

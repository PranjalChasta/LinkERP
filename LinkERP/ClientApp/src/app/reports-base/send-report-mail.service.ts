import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';
@Injectable({
  providedIn: 'root'
})
export class SendReportMailService {

  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }

  getUsersEMails() {
    this.url = this.baseurl + 'api/Report/ReportEmail/GetUsersEMails';
    return this.http.get(this.url);
  }
  getDocumentTemplatesByReport(ReportID) {
    this.url = this.baseurl + 'api/Report/ReportEmail/GetDocumentTemplatesByReport/' + ReportID;
    return this.http.get(this.url);
  }

}

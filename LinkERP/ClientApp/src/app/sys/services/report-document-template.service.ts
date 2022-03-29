import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ReportDocumentTemplateService {

  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  getReportNames(DocumentTemplateID) {
    this.url = this.baseurl + 'api/SYS/ReportDocumentTemplate/GetReportNames/' + DocumentTemplateID;
    return this.http.get(this.url);
  }

  addReportDocumentTemplate(data) {
    this.url = this.baseurl + 'api/SYS/ReportDocumentTemplate/AddReportDocumentTemplate';
    return this.http.post(this.url, data);
  }
  getReportDocumentTemplate(DocumentTemplateID) {
    this.url = this.baseurl + 'api/SYS/ReportDocumentTemplate/GetReportDocumentTemplate/' + DocumentTemplateID;
    return this.http.get(this.url);
  }
}

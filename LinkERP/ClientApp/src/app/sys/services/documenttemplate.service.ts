import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class DocumenttemplateService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }

  getAllDocumentTemplates() {
    this.url = this.baseurl + 'api/SYS/DocumentTemplate/GetAllDocumentTemplates';
    return this.http.get(this.url);
  }
  addDocumentTemplate(data) {
    this.url = this.baseurl + 'api/SYS/DocumentTemplate/AddDocumentTemplate';
    return this.http.post(this.url, data);
  }
  updateDocumentTemplate(data) {
    this.url = this.baseurl + 'api/SYS/DocumentTemplate/UpdateDocumentTemplate';
    return this.http.post(this.url, data);
  }
  getDocumentTemplateByID(ID) {
    this.url = this.baseurl + 'api/SYS/DocumentTemplate/GetDocumentTemplateByID/' + ID;
    return this.http.get(this.url);
  }
  deleteDocumentTemplateByID(ID, LoginID) {
    this.url = this.baseurl + 'api/SYS/DocumentTemplate/DeleteDocumentTemplateByID/' + ID + '/' + LoginID;
    return this.http.post(this.url, null);
  }
  
}

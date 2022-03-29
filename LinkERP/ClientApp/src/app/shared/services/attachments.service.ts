import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class AttachmentsService {
  private url: string = "";
  private baseurl: string = "";

 constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
 } 
  addattachments(data) {
    this.url = this.baseurl + 'api/SHARED/Attachments/AddAttachments';
    return this.http.post(this.url, data);
  }
  getAllAttachments() {
    this.url = this.baseurl + 'api/SHARED/Attachments/GetAllAttachments';
    return this.http.get(this.url);
  }

  deleteAttachmentsBYID(ID, LoginID) {
    this.url = this.baseurl + 'api/SHARED/Attachments/DeleteAttachmentsBYID/' + ID + '/' + LoginID;
    return this.http.post(this.url, null);
  }

  getAllAttachmentsByRecID(RecID) {
    this.url = this.baseurl + 'api/SHARED/Attachments/GetAllAttachmentsByRecID/'+ RecID;
    return this.http.get(this.url);
  }
  
  getAttachmentByID(ID) {
    this.url = this.baseurl + 'api/SHARED/Attachments/GetAttachmentByID/'+ID;
    return this.http.get(this.url);
  }
}

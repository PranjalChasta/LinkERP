import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }

  getRoles() {
    this.url = this.baseurl + 'api/DOC/Documents/GetRoles';
    return this.http.get(this.url);
  }
  getCategories() {
    this.url = this.baseurl + 'api/DOC/Documents/GetCategories';
    return this.http.get(this.url);
  }
  getSubCategories(categoryID) {
    this.url = this.baseurl + 'api/DOC/Documents/GetSubCategories/' + categoryID;
    return this.http.get(this.url);
  }
  addDocument(data) {
    this.url = this.baseurl + 'api/DOC/Documents/AddDocument';
    return this.http.post(this.url, data);
  }
  updateDocument(data) {
    this.url = this.baseurl + 'api/DOC/Documents/UpdateDocument';
    return this.http.post(this.url, data);
  }
  getAllDocuments() {
    this.url = this.baseurl + 'api/DOC/Documents/GetAllDocuments';
    return this.http.get(this.url);
  }
  getDocumentsBySearch(SearchText) {
    this.url = this.baseurl + 'api/DOC/Documents/GetDocumentsBySearch/' + SearchText;
    return this.http.get(this.url);
  }
  getDocumentAttributes(FileID) {
    this.url = this.baseurl + 'api/DOC/Documents/GetDocumentAttributes/' + FileID;
    return this.http.get(this.url);
  }

  getDocumentByID(FileID) {
    this.url = this.baseurl + 'api/DOC/Documents/GetDocumentByID/' + FileID;
    return this.http.get(this.url);
  }
  downloadFile(FileID) {
    this.url = this.baseurl + 'api/DOC/Documents/DownloadFile/' + FileID;
    return this.http.get(this.url);
  }


}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class TenderTypesService {
  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  GetTenderTypes() {
    this.url = this.baseurl + 'api/POS/TenderTypes/GetTenderTypes';
    return this.http.get(this.url);
  }

  addTenderTypes(data) {
    this.url = this.baseurl + 'api/POS/TenderTypes/AddTenderTypes';
    return this.http.post(this.url, data);
  }
  updateTenderTypes(data) {
    this.url = this.baseurl + 'api/POS/TenderTypes/UpdateTenderTypes';
    return this.http.post(this.url, data);
  }
  deleteRecordsBYID(ID, TableName, DeletedBy) {
    this.url = this.baseurl + 'api/SHARED/DeleteRecords/DeleteRecordsBYID/' + ID + '/' + TableName + '/' + DeletedBy;
    return this.http.post(this.url, null);
  }
  BindtenderypyeID(ID: any) {
    debugger;
    this.url = this.baseurl + 'api/POS/TenderTypes/GetTenderTypeID/' + ID;
    return this.http.get(this.url);
  }
}

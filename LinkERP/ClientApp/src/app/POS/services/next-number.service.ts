import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class NextNumberService {

  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  GetNextNumbers() {
    this.url = this.baseurl + 'api/POS/NextNumber/GetNextNumber';
    return this.http.get(this.url);
  }

  addNextNumber(data) {
    this.url = this.baseurl + 'api/POS/NextNumber/AddNextNumber';
    return this.http.post(this.url, data);
  }
  updateNextNumber(data) {
    this.url = this.baseurl + 'api/POS/NextNumber/UpdateNextNumber';
    return this.http.post(this.url, data);
  }
  deleteRecordsBYID(ID, TableName, DeletedBy) {
    this.url = this.baseurl + 'api/SHARED/DeleteRecords/DeleteRecordsBYID/' + ID + '/' + TableName + '/' + DeletedBy;
    return this.http.post(this.url, null);
  }
}

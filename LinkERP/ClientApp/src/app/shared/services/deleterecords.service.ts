import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class DeleteRecordsService {
  private url: string = "";
  private baseurl: string = "";
 constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
 } 
 
deleteRecordsBYID(ID, TableName, DeletedBy) {
  this.url = this.baseurl + 'api/SHARED/DeleteRecords/DeleteRecordsBYID/' + ID + '/' + TableName+'/' + DeletedBy;
  return this.http.post(this.url, null);
}
 
}

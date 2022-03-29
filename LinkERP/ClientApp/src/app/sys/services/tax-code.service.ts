import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';


@Injectable({
  providedIn: 'root'
})
export class TaxCodeService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  getAllTaxCode() {
    this.url = this.baseurl + 'api/SYS/TaxCode/GetAllTaxCode';
    return this.http.get(this.url);
  }
  addTaxCode(data) {
    this.url = this.baseurl + 'api/SYS/TaxCode/AddTaxCode';
    return this.http.post(this.url, data);
  }
  updateTaxCode(data) {
    this.url = this.baseurl + 'api/SYS/TaxCode/UpdateTaxCode';
    return this.http.post(this.url, data);
  }
  getTaxCodeByID(ID) {
    this.url = this.baseurl + 'api/SYS/TaxCode/GetTaxCodeByID/' + ID;
    return this.http.get(this.url);
  }
  deleteRecordsBYID(ID, TableName, DeletedBy) {
    this.url = this.baseurl + 'api/SHARED/DeleteRecords/DeleteRecordsBYID/' + ID + '/' + TableName + '/' + DeletedBy;
    return this.http.post(this.url, null);
  }

}

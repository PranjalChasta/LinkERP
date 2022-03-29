import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class MakeService {
  private url: string = "";
  private baseurl: string = "";


  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  } 
  getMake() {
    debugger;
    this.url = this.baseurl + 'api/INV/Make/Make/GetMake';
    return this.http.get(this.url);
  }
  addMake(data) {
    this.url = this.baseurl + 'api/INV/Make/Make/AddMake';
    return this.http.post(this.url, data);
  }

  updateMake(data) {
    this.url = this.baseurl + 'api/INV/Make/Make/UpdateMake';
    return this.http.post(this.url, data);
  }
  getMakeByID(ID) {
    this.url = this.baseurl + 'api/INV/Make/Make/GetMakeByID/'+ ID;
    return this.http.get(this.url);
  }
  deleteMakeByID(ID, TableName, DeletedBy)
  {
     this.url = this.baseurl + 'api/SHARED/DeleteRecords/DeleteRecordsBYID/' + ID + '/' + TableName + '/' + DeletedBy;
     return this.http.post(this.url, null);
  }
  updateModelDetails(data){
    debugger;
    this.url = this.baseurl + 'api/INV/Make/MakeModel/MakeModel/AddUpdateMakeModelData';
    return this.http.post(this.url, data);
  }
  AddUpdateMakeData(data){
    debugger;
    this.url = this.baseurl + 'api/INV/Make/Make/AddUpdateMakeData';
    return this.http.post(this.url, data);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';


@Injectable({
  providedIn: 'root'
})
export class TableDataService {
  private url: string = "";
  private baseurl: string = ""; 
  
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  getAllTables(){
    this.url = this.baseurl + 'api/SYS/GenericMasterTable/GetAllTables';
    return this.http.get(this.url);
  }
  getTableDataByTableID(ID){
    this.url = this.baseurl + 'api/SYS/GenericMasterTable/GetDataByID/' + ID;
    return this.http.get(this.url);
  }
  GetPriceReasonById(ID){
    this.url = this.baseurl + 'api/SYS/GenericMasterTable/GetPriceChangeReasonDataByID/' + ID;
    return this.http.get(this.url);
  }
  getAllTableData(){
    this.url = this.baseurl + 'api/SYS/GenericMasterTable/GetAllTableData';
    return this.http.get(this.url);
  }
  GetLookup(){
    this.url = this.baseurl + 'api/SHARED/TableData/GetLookup';
    return this.http.get(this.url);
  }
  addTableData(data) {
    this.url = this.baseurl + 'api/SYS/GenericMasterTable/AddTableData';
    return this.http.post(this.url, data);
  }
  updateTableData(data) {
    this.url = this.baseurl + 'api/SYS/GenericMasterTable/UpdateTableData';
    return this.http.post(this.url, data);
  }
  getTableDataByTableDataID(ID) {
    this.url = this.baseurl + 'api/SYS/GenericMasterTable/GetTableDataByTableDataID/' + ID;
    return this.http.get(this.url);
  }
  getAllModulesTables(Module){
    this.url = this.baseurl + 'api/SYS/GenericMasterTable/GetAllModulesTables/' + Module;
    return this.http.get(this.url);
  }

  getChildLookup(TableCode,ParentCode){
    this.url = this.baseurl + 'api/SYS/GenericMasterTable/GetChildLookup/'  + TableCode + '/' + ParentCode;
    return this.http.get(this.url);
  }
  addUpdateParentData(data) {
    this.url = this.baseurl + 'api/SYS/GenericMasterTable/AddUpdateParentData';
    return this.http.post(this.url, data);
  }
}

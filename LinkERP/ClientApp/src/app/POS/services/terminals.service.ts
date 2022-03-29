import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class TerminalsService {
  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) { 
    this.baseurl = appConfigService.getServiceBaseUrl();
  }

  GetTerminalsList() {
    this.url = this.baseurl + 'api/POS/Terminals/GetTerminalsList';
    return this.http.get(this.url);
  }

  addTerminals(data){
    this.url = this.baseurl + 'api/POS/Terminals/AddTerminal';
    return this.http.post(this.url,data);
  }
  updateTerminals(data){
    this.url = this.baseurl + 'api/POS/Terminals/UpdateTerminal';
    return this.http.post(this.url,data);
  }
  deleteRecordsBYID(ID, TableName,DeletedBy) {
    this.url = this.baseurl + 'api/SHARED/DeleteRecords/DeleteRecordsBYID/' + ID + '/' + TableName+'/' + DeletedBy;
    return this.http.post(this.url, null);
  }
  getTerminalGroupByTerminalID(ID){
    this.url = this.baseurl + 'api/POS/TerminalGroups/GetTerminalGroupList/'+ ID;
    return this.http.get(this.url);
  }
  addTerminalGroup(data){
    this.url = this.baseurl + 'api/POS/TerminalGroups/AddTerminalGroup';
    return this.http.post(this.url,data);
  }
  updateTerminalGroup(data){
    this.url = this.baseurl + 'api/POS/TerminalGroups/UpdateTerminalGroup';
    return this.http.post(this.url,data);
  }
  getTerminalGroupItemsByTerminalGroupID(ID){
    this.url = this.baseurl + 'api/POS/TerminalGroupItem/GetTerminalGroupItemList/'+ ID;
    return this.http.get(this.url);
  }
  addTerminalGroupItem(data){
    this.url = this.baseurl + 'api/POS/TerminalGroupItem/AddTerminalGroupItem';
    return this.http.post(this.url,data);
  }
  updateTerminalGroupItem(data){
    this.url = this.baseurl + 'api/POS/TerminalGroupItem/UpdateTerminalGroupItem';
    return this.http.post(this.url,data);
  }
  getProductList(WarehouseId,CompanyID){
    this.url = this.baseurl + 'api/POS/TerminalGroupItem/GetProductForTerminalGroupItem/'+ WarehouseId+'/'+CompanyID;
    return this.http.get(this.url);
  
  }
  GetMachinesConfigurataions(){
    debugger;
    this.url = this.baseurl + 'api/POS/Terminals/GetConfigurataions';
    return this.http.get(this.url);
  }
  GetMachinesConfigurataionsByID(CompanyID){
    debugger;
    this.url = this.baseurl + 'api/POS/Terminals/GetConfigurataionsByID/' + CompanyID;
    return this.http.get(this.url);
  }
  UpdateTerminalConfigurations(data){
    debugger;
    this.url = this.baseurl + 'api/POS/Terminals/UpdateTerminalConfigurations/';
    return this.http.post(this.url, data);
  }
}

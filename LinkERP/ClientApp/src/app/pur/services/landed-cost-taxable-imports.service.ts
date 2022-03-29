import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class LandedCostTaxableImportsService {
  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
   }
   getLandedCostTaxableImportsByCostID(CostID) {
    this.url = this.baseurl + 'api/PUR/LandedCostTaxableImports/GetLandedCostTaxableImportsCostID/'+CostID;
    return this.http.get(this.url);
  }

  addLandedCostTaxableImports(data) {
    this.url = this.baseurl + 'api/PUR/LandedCostTaxableImports/AddLandedCostTaxableImports';
    return this.http.post(this.url, data);
  }
  updateLandedCostTaxableImports(data) {
    this.url = this.baseurl + 'api/PUR/LandedCostTaxableImports/UpdateLandedCostTaxableImports';
    return this.http.post(this.url, data);
  }

  getLandedCostTaxableImportsByID(ID) {
    this.url = this.baseurl + 'api/PUR/LandedCostTaxableImports/GetLandedCostTaxableImportsByID/'+ ID;
    return this.http.get(this.url);
  }
  getLedger()
  {
    this.url = this.baseurl + 'api/PUR/Vendor/GetLedger';
    return this.http.get(this.url);
  }
  submitLandedCostTaxableImports(data){
    this.url = this.baseurl + 'api/PUR/LandedCostTaxableImports/SubmitLandedCostTaxableImports';
    return this.http.post(this.url, data);
  }
  // deleteLandedCostTaxableImports(id){
  //   this.url = this.baseurl + 'api/PUR/LandedCostTaxableImports/DeleteLandedCostTaxableImports';
  //   return this.http.post(this.url, id);
  // }
  deleteLandedCostTaxableImportsByID(ID, TableName, DeletedBy) {
    this.url = this.baseurl + 'api/SHARED/DeleteRecords/DeleteRecordsBYID/' + ID + '/' + TableName + '/' + DeletedBy;
    return this.http.post(this.url, null);
  }

 
}

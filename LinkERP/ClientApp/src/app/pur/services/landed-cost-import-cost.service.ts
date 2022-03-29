import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
    providedIn: 'root'
})
export class LandedCostImportCostService {
    private url: string = "";
    private baseurl: string = "";
    constructor(public http: HttpClient, private appConfigService: AppConfigService) {
        this.baseurl = appConfigService.getServiceBaseUrl();
    }
    getLandedCostImportCostByCostID(CostID) {
        this.url = this.baseurl + 'api/PUR/LandedCostImportCost/GetLandedImportCostByID/' + CostID;
        return this.http.get(this.url);
    }

    getLedger() {
        this.url = this.baseurl + 'api/PUR/Vendor/GetLedger';
        return this.http.get(this.url);
    }

    submitLandedImportCost(data) {
        this.url = this.baseurl + 'api/PUR/LandedCostImportCost/SubmitLandedImportCost';
        return this.http.post(this.url, data);
    }
    deleteLandedImportCostByID(ID, TableName, DeletedBy) {
        this.url = this.baseurl + 'api/SHARED/DeleteRecords/DeleteRecordsBYID/' + ID + '/' + TableName + '/' + DeletedBy;
        return this.http.post(this.url, null);
    }

    getTaxCode() {
        this.url = this.baseurl + 'api/PUR/LandedCostImportCost/GetTaxDetails';
        return this.http.get(this.url);
    }

}

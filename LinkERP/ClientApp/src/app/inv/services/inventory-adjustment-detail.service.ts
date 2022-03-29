import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/app-config.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class InventoryAdjustmentDetailService {
    private url: string = "";
    private baseurl: string = "";
    constructor(
        public http: HttpClient,
        private appConfigService: AppConfigService) {
        this.baseurl = appConfigService.getServiceBaseUrl();
    }

    getInventoryAdjustmentDetailByAdjustmentID(AdjustmentID) {
        debugger;
        this.url = this.baseurl + 'api/INV/InventoryAdjustmentDetail/InventoryAdjustmentDetail/GetInventoryAdjustmentDetailByAdjustmentID/' + AdjustmentID;
        return this.http.get(this.url);
    }

    getInventoryAdjustmentByID(ID) {
        debugger;
        this.url = this.baseurl + 'api/INV/InventoryAdjustmentDetail/InventoryAdjustmentDetail/GetInventoryAdjustmentDetailByID/' + ID;
        return this.http.get(this.url);
    }
    addInventoryAdjustment(data) {
        this.url = this.baseurl + 'api/INV/InventoryAdjustmentDetail/InventoryAdjustmentDetail/AddInventoryAdjustmentDetail';
        return this.http.post(this.url, data);
    }

    UpdateInventoryAdjustment(data) {
        this.url = this.baseurl + 'api/INV/InventoryAdjustmentDetail/InventoryAdjustmentDetail/UpdateInventoryAdjustmentDetail';
        return this.http.post(this.url, data);
    }
    UpdateInventoryAdjustmentDetailList(data) {
        this.url = this.baseurl + 'api/INV/InventoryAdjustmentDetail/InventoryAdjustmentDetail/InventoryAdjustmentDetailList';
        return this.http.post(this.url, data);
    }
    updateInventoryAdjustmentSerlisedList(data) {
        this.url = this.baseurl + 'api/INV/InventoryAdjustmentDetail/InventoryAdjustmentDetail/UpdateInventoryAdjustmentSerlisedList';
        return this.http.post(this.url, data);
    }

    UpdateInventoryAdjustmentProductStyleMatrixList(data) {
        this.url = this.baseurl + 'api/INV/InventoryAdjustmentDetail/InventoryAdjustmentDetail/UpdateInventoryAdjustmentProductStyleMatrixList';
        return this.http.post(this.url, data);
    }
    updateInventoryAdjustmentProductStyleMatrixList(data) {
        this.url = this.baseurl + 'api/INV/InventoryAdjustmentDetail/InventoryAdjustmentDetail/UpdateInventoryAdjustmentProductStyleMatrixList';
        return this.http.post(this.url, data);
    }
    updateInventoryAdjustmentSerlisedListOut(data) {
        this.url = this.baseurl + 'api/INV/InventoryAdjustmentDetail/InventoryAdjustmentDetail/InventoryAdjustmentSerlisedListOut';
        return this.http.post(this.url, data);
    }
    
    getInventoriesForAdjustmentdetailsID(WarehouseID) { 
        this.url = this.baseurl + 'api/INV/InventoryAdjustmentDetail/InventoryAdjustmentDetail/GetInventoriesForAdjustmentdetails/' + WarehouseID; ;
        return this.http.get(this.url);
    }

    getAdjustmentSerlisedByRecID(AdjustmentDetailID) { 
        this.url = this.baseurl + 'api/INV/InventoryAdjustmentDetail/InventoryAdjustmentDetail/GetAdjustmentSerlisedByRecID/' + AdjustmentDetailID;
        return this.http.get(this.url);
    }

    deleteAdjustmentSerialisedProduct(ID,DeletedBy) {
        this.url = this.baseurl + 'api/INV/InventoryAdjustmentDetail/InventoryAdjustmentDetail/DeleteAdjustmentSerialisedProduct/' + ID +'/' + DeletedBy;
        return this.http.post(this.url, null);
      }

      getAdjustmentProductMatrixByRecID(ProductID,AdjustmentDetailID) { 
        this.url = this.baseurl + 'api/INV/InventoryAdjustmentDetail/InventoryAdjustmentDetail/GetAdjustmentProductMatrixByRecID/' + ProductID+'/' + AdjustmentDetailID;;
        return this.http.get(this.url);
    }
    sortColumns(columnName) { 
        this.url = this.baseurl + 'api/INV/InventoryAdjustmentDetail/InventoryAdjustmentDetail/SortColumns/' + columnName;
        return this.http.get(this.url);
    }
}

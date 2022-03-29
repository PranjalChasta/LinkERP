import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
    providedIn: 'root'
})
export class PurchaseOrderDetailService {
    private url: string = "";
    private baseurl: string = "";
    constructor(public http: HttpClient, private appConfigService: AppConfigService) {
        this.baseurl = appConfigService.getServiceBaseUrl();
    }
   
    getPurchaseOrderByID(ID) {
        debugger;
        this.url = this.baseurl + 'api/PUR/PurchaseMainDetail/PurchaseMainDetail/GetPurchaseMainDetailByID/' + ID;
        return this.http.get(this.url);
    }
    addPurchaseOrderDetail(data) {
        this.url = this.baseurl + 'api/PUR/PurchaseMainDetail/PurchaseMainDetail/AddPurchaseMainDetail';
        return this.http.post(this.url, data);
    }
    UpdatePurchaseOrderDetail(data) {
        this.url = this.baseurl + 'api/PUR/PurchaseMainDetail/PurchaseMainDetail/UpdatePurchaseMainDetail';
        return this.http.post(this.url, data);
    }

    deletePurchaseOrderDetailID(ID, TableName, DeletedBy) {
        this.url = this.baseurl + 'api/SHARED/DeleteRecords/DeleteRecordsBYID/' + ID + '/' + TableName + '/' + DeletedBy;
        return this.http.post(this.url, null);
    }
    
    getClassificationDetail() {
        this.url = this.baseurl + 'api/PUR/PurchaseTemplateDetail/PurchaseTemplateDetail/GetClassification';
        return this.http.get(this.url);
    }

    getInventories() {
        this.url = this.baseurl + 'api/INV/Inventory/GetAllInventories';
        return this.http.get(this.url);
    }

    getSupplierSKU(VendorID){
        this.url = this.baseurl + 'api/PUR/PurchaseMainDetail/PurchaseMainDetail/GetSupplierSKU/'+ VendorID;
        return this.http.get(this.url);
    }
    
    updatePurchaseOrderDetailsStatus(data) {
        this.url = this.baseurl + 'api/PUR/PurchaseMainDetail/PurchaseMainDetail/UpdatePurchaseDetails';
        return this.http.post(this.url, data);
    }

    updatepurchaseDetailsProductStyleMatrixList(data) {
        this.url = this.baseurl + 'api/PUR/PurchaseMainDetail/PurchaseMainDetail/UpdatepurchaseDetailsProductStyleMatrixList';
        return this.http.post(this.url, data);
      }

      getProductMatrixByRecID(ProductID,PurchaseDetailID) {
        this.url = this.baseurl + 'api/PUR/PurchaseMainDetail/PurchaseMainDetail/GetProductMatrixByRecID/' + ProductID+'/'+PurchaseDetailID;
        return this.http.get(this.url);
      }

      GetInventoryForPO(PurchaseOrderID) {
        this.url = this.baseurl + 'api/PUR/PurchaseMainDetail/PurchaseMainDetail/GetInventoryForPO/' + PurchaseOrderID;
        return this.http.get(this.url);
    }

    GetPurchaseDetailByRecID(ID) {
        this.url = this.baseurl + 'api/PUR/PurchaseMainDetail/PurchaseMainDetail/GetPurchaseDetailByRecID/' +ID;
        return this.http.get(this.url);
      }
      addPurchaseMainDetailList(data) {
        this.url = this.baseurl + 'api/PUR/PurchaseMainDetail/PurchaseMainDetail/AddPurchaseMainDetailList';
        return this.http.post(this.url, data);
    }

    getValidVendorPriceSchemeBYProductID(PurchaseID,ProductID) {
        this.url = this.baseurl + 'api/PUR/PurchaseMainDetail/PurchaseMainDetail/GetValidVendorPriceSchemeBYProductID/' + PurchaseID+'/'+ProductID;
        return this.http.get(this.url);
      }
      getValidVendorSKUBYProductID(PurchaseID,ProductID) {
        this.url = this.baseurl + 'api/PUR/PurchaseMainDetail/PurchaseMainDetail/GetValidVendorSKUBYProductID/' + PurchaseID+'/'+ProductID;
        return this.http.get(this.url);
      }
      getVendorPriceSchemeBYUOMID(PurchaseID,ProductID,UOMID) {
        this.url = this.baseurl + 'api/PUR/PurchaseMainDetail/PurchaseMainDetail/GetValidVendorPriceSchemeOnChangeUOM/' + PurchaseID+'/'+ProductID+'/'+UOMID;
        return this.http.get(this.url);
      }
      
      getcurencybyid(CompanyId,CurrencyId) {
        this.url = this.baseurl + 'api/PUR/PurchaseMainDetail/PurchaseMainDetail/GetCurencyById/' + CompanyId+'/'+CurrencyId;
        return this.http.get(this.url);
      }
      DeleteRowDetail(PurchaseDetailID) {
        this.url = this.baseurl + 'api/PUR/PurchaseMainDetail/PurchaseMainDetail/DeleteRowDetail/' + PurchaseDetailID;
        return this.http.get(this.url);
      }
      Costview(ProductID) {
        this.url = this.baseurl + 'api/PUR/PurchaseMainDetail/PurchaseMainDetail/Costview/' + ProductID;
        return this.http.get(this.url);
      }
}

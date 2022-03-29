import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class InvCommonService {
  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }

  getWarehousebyInventoryDetails(ProductID, ID) {
    debugger;
    this.url = this.baseurl + 'api/INV/InventoryDetail/InventoryDetail/GetInventoryDetailsID/' + ProductID + '/' + ID;
    return this.http.get(this.url);
  }

  getProductStyleMatrix() {
    this.url = this.baseurl + 'api/INV/Common/GetProductStyleMatrixes';
    return this.http.get(this.url);
  }
  getProductStyleMatrixDetails() {
    this.url = this.baseurl + 'api/INV/Common/GetProductStyleMatrixDetails';
    return this.http.get(this.url);
  }
  addInventory(data) {
    this.url = this.baseurl + 'api/INV/InventoryDetail/InventoryDetail/AddInventory';
    return this.http.post(this.url, data);
  }
  getGenericNames() {
    this.url = this.baseurl + 'api/INV/Common/GetGenericNames';
    return this.http.get(this.url);
  }
  getPromotionDays() {
    this.url = this.baseurl + 'api/INV/Common/GetPromotionDays';
    return this.http.get(this.url);
  }

  getWareHouse() {
    this.url = this.baseurl + 'api/INV/Common/GetWareHouseKit';
    return this.http.get(this.url);
  }
  getWareHouseByRole() {
    this.url = this.baseurl + 'api/INV/Common/GetWareByRoleID';
    return this.http.get(this.url);
  }
  getVendor() {
    this.url = this.baseurl + 'api/INV/Common/GetVendorKit';
    console.log(this.url);
    return this.http.get(this.url);
  }

  getInventory() {
    this.url = this.baseurl + 'api/INV/Common/GetParentProductKit';
    return this.http.get(this.url);
  }
  getInvCycle() {
    this.url = this.baseurl + 'api/INV/Common/GetInvCycle';
    return this.http.get(this.url);
  }

  getWareHouseBins() {
    this.url = this.baseurl + 'api/INV/Common/GetWareHouseBins';
    return this.http.get(this.url);
  }
  getWareHouseBin() {
    this.url = this.baseurl + 'api/INV/Common/GetWareHouseBin';
    return this.http.get(this.url);
  }
  getInventoryStockTakes() {
    this.url = this.baseurl + 'api/INV/Common/GetInventoryStockTakes';
    return this.http.get(this.url);
  }
  getInventories() {
    this.url = this.baseurl + 'api/INV/Common/GetInventories';
    return this.http.get(this.url);
  }
  getTaxCodes() {
    this.url = this.baseurl + 'api/INV/Common/GetTaxCodes';
    return this.http.get(this.url);
  }
  getTaxAmountsbyTaxID(TaxCodeID) {
    this.url = this.baseurl + 'api/INV/Common/GetTaxAmount/' + TaxCodeID;
    return this.http.get(this.url);
  }
  getInventoryForTransfer() {
    this.url = this.baseurl + 'api/INV/Common/GetProductForTransfer';
    return this.http.get(this.url);
  }
  getActivePriceGroups() {
    this.url = this.baseurl + 'api/INV/Common/GetAllActivePriceGroups';
    return this.http.get(this.url);
  }
  getUsers() {
    this.url = this.baseurl + 'api/SYS/Common/GetUserKit';
    return this.http.get(this.url);
  }
  getalldebtor() {
    this.url = this.baseurl + 'api/SYS/Common/GetAllDebtors';
    return this.http.get(this.url);
  }
  getConfigurationByFlag(flag) {
    this.url = this.baseurl + 'api/INV/Common/GetConfigurationByFlag/' + flag;
    return this.http.get(this.url);
  }
  getWareHouseBinByWareHouseID(WareHouseID) {
    this.url = this.baseurl + 'api/INV/Common/GetWareHouseBinByWareHouseID/' + WareHouseID;
    return this.http.get(this.url);
  }
  getActiveWareHouseBin() {
    this.url = this.baseurl + 'api/INV/WareHouseBin/GetWareHouseBins/';
    return this.http.get(this.url);
  }
  getUnitOfMeasures() {
    this.url = this.baseurl + 'api/INV/Common/GetUnitOfMeasures';
    return this.http.get(this.url);
  }
  getInvetoryForPO() {
    this.url = this.baseurl + 'api/PUR/Common/GetInvetoryForPO';
    return this.http.get(this.url);
  }
  getAllPriceAudit() {
    this.url = this.baseurl + 'api/INV/InventoryPriceChangeAudit/PriceChangeAudit/GetAllPriceChangeAudits';
    return this.http.get(this.url);
  }
  getTerminals() {
    this.url = this.baseurl + 'api/POS/Common/GetTerminals';
    return this.http.get(this.url);
  }
}

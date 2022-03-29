import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class SysCommonService {

  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  //To fetch Companies records from API
  getCompanies() {
    this.url = this.baseurl + 'api/SYS/Common/GetCompanies';
    return this.http.get(this.url);
  }
  getCountryStateCity() {
    this.url = this.baseurl + 'api/SYS/Common/GetCountryStateCity';
    return this.http.get(this.url);
  }
  getCountry() {
    this.url = this.baseurl + 'api/SYS/Common/GetCountry';
    return this.http.get(this.url);
  }
  getStateBYCountryID(CountryID: any) {
    this.url = this.baseurl + 'api/SYS/Common/GetStateBYCountryID/' + CountryID;
    return this.http.get(this.url);
  }


  //To fetch Countries records from API
  getCountries() {
    this.url = this.baseurl + 'api/SYS/Common/GetCountries';
    return this.http.get(this.url);
  }

  //To fetch States records by Country ID from API
  getStatesBYCountryID(countryID) {
    this.url = this.baseurl + 'api/SYS/Common/GetStatesBYCountryID/' + countryID;
    return this.http.get(this.url);
  }
  //To fetch Cities records by State ID from API
  getCitiesByStateID(stateID) {
    this.url = this.baseurl + 'api/SYS/Common/GetCitiesByStateID/' + stateID;
    return this.http.get(this.url);
  }
  getModules() {
    this.url = this.baseurl + 'api/SYS/Common/GetModules';
    return this.http.get(this.url);
  }
  getModulesByRoleID(RoleID) {
    this.url = this.baseurl + 'api/SYS/Common/GetModulesByRokeID/' + RoleID;
    return this.http.get(this.url);
  }
  getLookupByID(TableCode) {
    this.url = this.baseurl + 'api/SHARED/GenricTablesLookup/GetLookupByID/' + TableCode;
    return this.http.get(this.url);
  }
  getChildLookup(TableCode, ParentCode) {
    this.url = this.baseurl + 'api/SHARED/GenricTablesLookup/GetChildLookup/' + TableCode + '/' + ParentCode;
    return this.http.get(this.url);
  }
  getInventoryVendor(InventoryID) {
    this.url = this.baseurl + 'api/INV/InventoryVendor/InventoryVendor/GetInventoryVendorByInventoryID/' + InventoryID;
    return this.http.get(this.url);
  }

  getInventoryUnitOfMeasure(InventoryID) {
    this.url = this.baseurl + 'api/INV/InventoryUnit_Of_MeasureConversions/InventoryUnitOfMeasureConversions/GetInventoryUnitOfMeasureByInventryID/' + InventoryID;
    return this.http.get(this.url);
  }
  getRoles() {
    this.url = this.baseurl + 'api/SYS/Common/GetRoles';
    return this.http.get(this.url);
  }

  getInventoryDebtorPrice(InventoryID) {
    this.url = this.baseurl + 'api/INV/InventoryDebtorPrice/InventoryDebtorPrice/GetInventoryDebtorPriceByInventoryID/' + InventoryID;
    return this.http.get(this.url);
  }
  getParentProductKits() {
    this.url = this.baseurl + 'api/INV/Common/GetParentProductKit';
    return this.http.get(this.url);
  }
  getMakeDetails(MakeID) {
    debugger;
    this.url = this.baseurl + 'api/INV/Make/MakeModel/MakeModel/GetMakeModelByMakeID/' + MakeID;
    return this.http.get(this.url);
  }
  getSeriesByMakeIDDetails(MakeID, ModelID) {
    debugger;
    this.url = this.baseurl + 'api/INV/Make/Series/Series/GetSeriesByMakeID/' + MakeID + '/' + ModelID;
    return this.http.get(this.url);
  }
  getEngineIDDetails(MakeID, ModelID) {
    debugger;
    this.url = this.baseurl + 'api/INV/Make/Engine/Engine/GetEngineByMakeID/' + MakeID + '/' + ModelID;
    return this.http.get(this.url);
  }

  getSeriesByModelIDDetails(ModelID) {
    debugger;
    this.url = this.baseurl + 'api/INV/Make/Series/Series/GetSeriesByModelID/' + ModelID;
    return this.http.get(this.url);
  }

  getUser() {
    this.url = this.baseurl + 'api/SYS/Common/GetUserKit';
    return this.http.get(this.url);
  }

  getFinishedProducts() {
    this.url = this.baseurl + 'api/INV/Common/GetParentProductKit';
    return this.http.get(this.url);
  }

  getWorkflow() {
    this.url = this.baseurl + 'api/SYS/Common/GetWorkFlow';
    return this.http.get(this.url);
  }

  getTaxCode() {
    this.url = this.baseurl + 'api/SYS/Common/GetTaxCode';
    return this.http.get(this.url);
  }

  getCurrency() {
    this.url = this.baseurl + 'api/SYS/Common/GetCurrency';
    return this.http.get(this.url);
  }

  getActiveCountries() {
    this.url = this.baseurl + 'api/SYS/Common/GetActiveCountries';
    return this.http.get(this.url);
  }

  getUOMConvertionsByInventryID(InventoryID) {
    this.url = this.baseurl + 'api/INV/Common/GetUOMConvertionsByInventryID/' + InventoryID;
    return this.http.get(this.url);
  }
  searchProduct(searchParams) {
    this.url = this.baseurl + 'api/INV/Common/SearchProduct';
    return this.http.post(this.url, searchParams);
  }
  getProductByID(ProductID, Module, WarehouseId) {
    if (WarehouseId == undefined) {
      this.url = this.baseurl + 'api/INV/Common/GetProductByID/' + ProductID + '?Module=' + Module
    }
    else {
      this.url = this.baseurl + 'api/INV/Common/GetProductByID/' + ProductID + '?Module=' + Module + "&WarehouseId=" + WarehouseId;
    }
    return this.http.get(this.url);
  }
  getCategories() {
    this.url = this.baseurl + 'api/INV/Common/GetCategories';
    return this.http.get(this.url);
  }
  getAllSubCategories() {
    this.url = this.baseurl + 'api/INV/Common/GetAllSubCategories';
    return this.http.get(this.url);
  }
  getFrequency() {
    this.url = this.baseurl + 'api/SYS/Common/GetFrequency';
    return this.http.get(this.url);
  }
  getReportNames() {
    this.url = this.baseurl + 'api/SYS/Common/GetReportNames';
    return this.http.get(this.url);
  }
  getUsers() {
    this.url = this.baseurl + 'api/SYS/Common/GetUsers';
    return this.http.get(this.url);
  }
  getDebtors() {
    this.url = this.baseurl + 'api/SYS/Common/GetAllDebtors';
    return this.http.get(this.url);
  }
  searchDebtor(searchParams) {
    this.url = this.baseurl + 'api/INV/Debtor/SearchDebtor';
    return this.http.post(this.url, searchParams);
  }
  getDebtorByID(DebtorID, Module) {
    this.url = this.baseurl + 'api/INV/Debtor/GetDebtorByID/' + DebtorID + '?Module=' + Module
    return this.http.get(this.url);
  }
  getAdjustments() {
    this.url = this.baseurl + 'api/SYS/Common/GetAdjustments';
    return this.http.get(this.url);
  }
}

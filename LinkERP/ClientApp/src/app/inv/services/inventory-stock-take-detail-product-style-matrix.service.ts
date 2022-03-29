import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryStockTakeDetailProductStyleMatrixService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  addinventorystocktakedetailsproductStleMatrix(data) {
    this.url = this.baseurl + 'api/INV/InventoryStockTakeDetailProductStyleMatrix/InventoryStockTakeDetailProductStyleMatrix/AddInventoryStockTakeDetailProductStyleMatrix';
    return this.http.post(this.url, data);
  }
  updateInventoryStockTakeDetailProductStyleMatrix(data) {
    this.url = this.baseurl + 'api/INV/InventoryStockTakeDetailProductStyleMatrix/InventoryStockTakeDetailProductStyleMatrix/UpdateInventoryStockTakeDetailProductStyleMatrix';
    return this.http.post(this.url, data);
  }
  getStockTakeProductStyleMatrixByID(ProductID,WareHouseID,StockTakeDetailID,CompanyID,StockTakeNo) {
    this.url = this.baseurl + 'api/INV/InventoryStockTakeDetailProductStyleMatrix/InventoryStockTakeDetailProductStyleMatrix/GetInventoryStockTakeDetailProductStyleMatrixByID/' + ProductID+ '/' + WareHouseID+ '/' + StockTakeDetailID+ '/' + CompanyID+ '/' + StockTakeNo;;
    return this.http.get(this.url);
  }
  getAllInventoryStockTakeDetailProductStyleMatrix() {
    this.url = this.baseurl + 'api/INV/InventoryStockTakeDetailProductStyleMatrix/InventoryStockTakeDetailProductStyleMatrix/GetAllInventoryStockTakeDetailProductStyleMatrix';
    return this.http.get(this.url);
  }

  UpdateStockTakeDetailStyleMatrixList(data) {
    this.url = this.baseurl + 'api/INV/InventoryStockTakeDetailProductStyleMatrix/InventoryStockTakeDetailProductStyleMatrix/UpdateStockTakeDetailStyleMatrixList';
    return this.http.post(this.url, data);
  }
  getInventoryStockTakeDetailForSerlaisedProduct(ProductID,WareHouseID,StockTakeDetailID,CompanyID,StockTakeNo) {
    this.url = this.baseurl + 'api/INV/InventoryStockTakeDetailProductStyleMatrix/InventoryStockTakeDetailProductStyleMatrix/GetInventoryStockTakeDetailForSerlaisedProduct/' + ProductID+ '/' + WareHouseID+ '/' + StockTakeDetailID+ '/' + CompanyID+ '/' + StockTakeNo;;
    return this.http.get(this.url);
  }

  getInventoryStockTakeDetailForOtherProduct(ProductID,WareHouseID,StockTakeDetailID,CompanyID,StockTakeNo) {
    this.url = this.baseurl + 'api/INV/InventoryStockTakeDetailProductStyleMatrix/InventoryStockTakeDetailProductStyleMatrix/GetInventoryStockTakeDetailForOtherProduct/' + ProductID+ '/' + WareHouseID+ '/' + StockTakeDetailID+ '/' + CompanyID+ '/' + StockTakeNo;;
    return this.http.get(this.url);
  }
  SortColumns(ProductID,WareHouseID,StockTakeDetailID,CompanyID,StockTakeNo, ColumnName) {
    this.url = this.baseurl + 'api/INV/InventoryStockTakeDetailProductStyleMatrix/InventoryStockTakeDetailProductStyleMatrix/SortColumns/' + ProductID+ '/' + WareHouseID+ '/' + StockTakeDetailID+ '/' + CompanyID+ '/' + StockTakeNo+ '/' +ColumnName;
    return this.http.get(this.url);
  }
  SortMatrixColumns(ProductID,WareHouseID,StockTakeDetailID,CompanyID,StockTakeNo, ColumnName) {
    this.url = this.baseurl + 'api/INV/InventoryStockTakeDetailProductStyleMatrix/InventoryStockTakeDetailProductStyleMatrix/SortMatrixColumns/' + ProductID+ '/' + WareHouseID+ '/' + StockTakeDetailID+ '/' + CompanyID+ '/' + StockTakeNo+ '/' +ColumnName;
    return this.http.get(this.url);
  }
}

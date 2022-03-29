import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryStockAllocationDetailsService {
  private url: string = "";
  private baseurl: string = "";

  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  addInventoryStockAllocationDetails(data) {
    this.url = this.baseurl + 'api/INV/InventoryStock_Allocation-Details/InventoryStockAllocationDetails/AddInventoryStockAllocationDetail';
    return this.http.post(this.url, data);
  }
  updateInventoryStockAllocationDetails(data) {
    this.url = this.baseurl + 'api/INV/InventoryStock_Allocation-Details/InventoryStockAllocationDetails/UpdateInventoryStockAllocationDetail';
    return this.http.post(this.url, data);
  }
  getInventoryStockAllocationDetailsByID(ID) {

    this.url = this.baseurl + 'api/INV/InventoryStock_Allocation-Details/InventoryStockAllocationDetails/GetInventoryStockAllocationDetailsByID/' + ID;
    return this.http.get(this.url);
  }
  getInventoryStockAllocationDetailsByInventryID(InventryID) {

    this.url = this.baseurl + 'api/INV/InventoryStock_Allocation-Details/InventoryStockAllocationDetails/GetInventoryStockAllocationDetailsByInventryID/' + InventryID;
    return this.http.get(this.url);
  }
  getStockAllocationDetailsByInventoryAndWarehouse(InventryID, WarehouseID) {
    this.url = this.baseurl + 'api/INV/InventoryStock_Allocation-Details/InventoryStockAllocationDetails/GetStockAllocationDetailsByInventoryAndWarehouse/' + InventryID + "/" + WarehouseID;
    return this.http.get(this.url);
  }
  getInventoryStockAllocationDetailsByProductID(obj) {
    this.url = this.baseurl + 'api/INV/InventoryStock_Allocation-Details/InventoryStockAllocationDetails/GetInventoryStockAllocationDetailsByProductID';
    return this.http.post(this.url, obj);
  }
  getInventoryStockAllocationDetailsForTransfer(obj) {
    this.url = this.baseurl + 'api/INV/InventoryStock_Allocation-Details/InventoryStockAllocationDetails/GetInventoryStockAllocationDetailsForTransfer';
    return this.http.post(this.url, obj);
  }
  getInventoryStockAllocationForTransfer(CompanyID, ProductID, WarehouseID, TransferDetailID) {
    this.url = this.baseurl + 'api/INV/InventoryTransferDetail/InventoryTransferDetail/GetInventoryStockAllocationForTransfer/' + CompanyID + "/" + ProductID + "/" + WarehouseID + "/" + TransferDetailID;
    return this.http.get(this.url);
  }

  getInventoryStockAllocationBymatrixProduct(obj) {
    this.url = this.baseurl + 'api/INV/InventoryAdjustmentDetail/InventoryAdjustmentDetail/GetInventoryStockAllocationBymatrixProduct';
    return this.http.post(this.url, obj);
  }

  gtInventoryForMatrixTransferReceive(CompanyID, ProductID, WarehouseID, TransferDetailID) {
    this.url = this.baseurl + 'api/INV/InventoryTransferDetail/InventoryTransferDetail/GetInventoryForMatrixTransferReceive/' + CompanyID + "/" + ProductID + "/" + WarehouseID + "/" + TransferDetailID;
    return this.http.get(this.url);
  }
  getInventoryStockAllocationForSerialTransfer(CompanyID, ProductID, WarehouseID, TransferDetailID) {
    this.url = this.baseurl + 'api/INV/InventoryTransferDetail/InventoryTransferDetail/GetInventoryStockAllocationForSerialTransfer/' + CompanyID + "/" + ProductID + "/" + WarehouseID + "/" + TransferDetailID;
    return this.http.get(this.url);
  }
  SortColumns(data) {
    this.url = this.baseurl + 'api/INV/InventoryStock_Allocation-Details/InventoryStockAllocationDetails/SortColumns';
    return this.http.post(this.url, data);
  }
  matrixSortColumns(obj) {
    this.url = this.baseurl + 'api/INV/InventoryAdjustmentDetail/InventoryAdjustmentDetail/SortColumns';
    return this.http.post(this.url, obj);
  }

  getInventoryTransferSortColumns(CompanyID, ProductID, WarehouseID, TransferDetailID, ColumnName) {
    this.url = this.baseurl + 'api/INV/InventoryTransferDetail/InventoryTransferDetail/GetInventoryTransferSortColumns/' + CompanyID + "/" + ProductID + "/" + WarehouseID + "/" + TransferDetailID + "/" + ColumnName;
    return this.http.get(this.url);
  }
  SortColumnsSerialTransfer(CompanyID, ProductID, WarehouseID, TransferDetailID, ColumnName) {
    this.url = this.baseurl + 'api/INV/InventoryTransferDetail/InventoryTransferDetail/GetInventorySerialTransferColumnsSort/' + CompanyID + "/" + ProductID + "/" + WarehouseID + "/" + TransferDetailID + '/' + ColumnName;
    return this.http.get(this.url);
  }
  SortColumnsTransferAllocation(CompanyID, ProductID, WarehouseID, TransferDetailID,ColumnName) {
    this.url = this.baseurl + 'api/INV/InventoryTransferDetail/InventoryTransferDetail/GetInventoryTransferAllocationSortColumns/' + CompanyID + "/" + ProductID + "/" + WarehouseID + "/" + TransferDetailID + '/' + ColumnName;
    return this.http.get(this.url);
  }
  getInventoryTransferOutSortColumns(obj) {
    this.url = this.baseurl + 'api/INV/InventoryStock_Allocation-Details/InventoryStockAllocationDetails/getInventoryTransferOutSortColumns';
    return this.http.post(this.url, obj);
  }
}

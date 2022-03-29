import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/app-config.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InventoryTransferDetailService {
  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }

  getInventoryTransferDetailByTransferID(TransferID) {
    this.url = this.baseurl + 'api/INV/InventoryTransferDetail/InventoryTransferDetail/GetInventoryTransferDetailByInventoryTransferID/' + TransferID;
    return this.http.get(this.url);
  }

  getInventoryTransferByID(ID) {
    this.url = this.baseurl + 'api/INV/InventoryTransferDetail/InventoryTransferDetail/GetInventoryTransferDetailByID/' + ID;
    return this.http.get(this.url);
  }
  addInventoryTransferDetails(data) {
    this.url = this.baseurl + 'api/INV/InventoryTransferDetail/InventoryTransferDetail/InventoryTransferDetailList';
    return this.http.post(this.url, data);
  }

  UpdateInventoryTransfer(data) {
    this.url = this.baseurl + 'api/INV/InventoryTransferDetail/InventoryTransferDetail/UpdateInventoryTransferDetail';
    return this.http.post(this.url, data);
  }
  updateInventoryTransferSerlisedListOut(data) {
    this.url = this.baseurl + 'api/INV/InventoryTransferDetail/InventoryTransferDetail/InventoryTransferSerlisedListOut';
    return this.http.post(this.url, data);
  }
  getTransferSerlisedByRecID(TransferDetailID) {
    this.url = this.baseurl + 'api/INV/InventoryTransferDetail/InventoryTransferDetail/GetTransferSerlisedByRecID/'+TransferDetailID;
    return this.http.get(this.url);
  }
  deleteTransferSerialisedProduct(ID, DeletedBy) {
    this.url = this.baseurl + 'api/INV/InventoryTransferDetail/InventoryTransferDetail/DeleteTransferSerialisedProduct/' + ID + '/' + DeletedBy;
    return this.http.post(this.url, null);
  }
  updateInventoryTransferSerlisedList(data) {
    this.url = this.baseurl + 'api/INV/InventoryTransferDetail/InventoryTransferDetail/InventoryTransferSerlisedList';
    return this.http.post(this.url, data);
  }
  getTransferProductMatrixByRecID(ProductID,TransferID,TransferDetailID) {
    this.url = this.baseurl + 'api/INV/InventoryTransferDetail/InventoryTransferDetail/GetTransferProductMatrixByRecID/' + ProductID+'/'+TransferID+'/'+TransferDetailID;
    return this.http.get(this.url);
  }

  GetInventorylistForTransfer(WarehouseID) {
    this.url = this.baseurl + 'api/INV/InventoryTransferDetail/InventoryTransferDetail/GetInventorylistForTransfer/'+ WarehouseID;
    return this.http.get(this.url);
  }

  updateInventoryTransferDetailStatus(data) {
    this.url = this.baseurl + 'api/INV/InventoryTransferDetail/InventoryTransferDetail/UpdateInventoryTransferDetailStatus';
    return this.http.post(this.url, data);
  }
  UpdateInventoryTransferOtherListOut(data) {
    this.url = this.baseurl + 'api/INV/InventoryTransferDetail/InventoryTransferDetail/InventoryTransferOtherListOut';
    return this.http.post(this.url, data);
  }
  SortColumns(TransferDetailID,ColumnName) {
    this.url = this.baseurl + 'api/INV/InventoryTransferDetail/InventoryTransferDetail/SortColumns/'+TransferDetailID + '/' + ColumnName;
    return this.http.get(this.url);
  }
}

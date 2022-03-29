import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/app-config.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SopOrderService {

  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }
  GetAllOrderMains() {
    this.url = this.baseurl + 'api/POS/OrderMain/GetAllOrderMains';
    return this.http.get(this.url);
  }
  AddOrderMain(data) {
    this.url = this.baseurl + 'api/POS/OrderMain/AddOrderMain';
    return this.http.post(this.url, data);
  }

  UpdateOrderMain(data) {
    this.url = this.baseurl + 'api/POS/OrderMain/UpdateOrderMain';
    return this.http.post(this.url, data);
  }

  deleteRecordsBYID(ID, TableName, DeletedBy) {
    this.url = this.baseurl + 'api/SHARED/DeleteRecords/DeleteRecordsBYID/' + ID + '/' + TableName + '/' + DeletedBy;
    return this.http.post(this.url, null);
  }
  GetOrderMainByID(ID) {
    debugger;
    this.url = this.baseurl + 'api/POS/OrderMain/GetOrderMainByID/' + ID;
    return this.http.get(this.url);
  }

  GetCreditReasonList() {
    this.url = this.baseurl + 'api/POS/Common/GetCreditReason';
    return this.http.get(this.url);
  }

  GetAllOrderDetails(OrderID) {
    this.url = this.baseurl + 'api/POS/OrderDetail/GetAllOrderDetails/' + OrderID;
    return this.http.get(this.url);
  }

  DeleteOrderDetailByID(ID, TableName, DeletedBy) {
    this.url = this.baseurl + 'api/SHARED/DeleteRecords/DeleteRecordsBYID/' + ID + '/' + TableName + '/' + DeletedBy;
    return this.http.post(this.url, null);
  }

  AddOrderDetails(data) {
    this.url = this.baseurl + 'api/POS/OrderDetail/AddOrderDetail';
    return this.http.post(this.url, data);
  }
  UpdateOrderDetails(data) {
    this.url = this.baseurl + 'api/POS/OrderDetail/UpdateOrderDetail';
    return this.http.post(this.url, data);
  }
  GetInventoryDetail(WarehouseID) {
    this.url = this.baseurl + 'api/POS/QuotationDetail/GetInventoryDetails/' + WarehouseID;
    return this.http.get(this.url);
  }
  AddOrderDetailTaxLabel(data) {
    this.url = this.baseurl + 'api/POS/OrderDetailTaxLabel/AddOrderDetailTaxLabel';
    return this.http.post(this.url, data);
  }

  //To get Tax Labels after selection of tax
  gettaxLabelByTaxId(TaxID, LoginID) {
    this.url = this.baseurl + 'api/POS/OrderDetailTaxLabel/GetTaxLabelDetailByTaxID/' + TaxID + '/' + LoginID;
    return this.http.get(this.url);
  }
  //Get OrderDetails Tax Label List
  getOrderDetailTaxLabel() {
    this.url = this.baseurl + 'api/POS/OrderDetailTaxLabel/GetAllOrderDetailTaxLabels';
    return this.http.get(this.url);
  }

  //LBS_SOP_SalesOrderDetailKIT Starts
  GetAllOrderDetailKit(OrderID) {
    this.url = this.baseurl + 'api/POS/OrderDetailKit/GetAllOrderDetailKits/' + OrderID;
    return this.http.get(this.url);
  }

  AddOrderDetailKit(data) {
    this.url = this.baseurl + 'api/POS/OrderDetailKit/AddOrderDetailKit';
    return this.http.post(this.url, data);
  }

  UpdateOrderDetailKit(data) {
    this.url = this.baseurl + 'api/POS/OrderDetailKit/UpdateOrderDetailKit';
    return this.http.post(this.url, data);
  }

  DeleteOrderDetailKitByID(ID, TableName, DeletedBy) {
    this.url = this.baseurl + 'api/SHARED/DeleteRecords/DeleteRecordsBYID/' + ID + '/' + TableName + '/' + DeletedBy;
    return this.http.post(this.url, null);
  }
  //LBS_SOP_SalesOrderDetailKIT End


  //LBS_SOP_SalesOrderDetailPriceScheme Starts
  GetAllOrderDetailPriceGroup(OrderID) {
    this.url = this.baseurl + 'api/POS/OrderDetailPriceGroup/GetAllOrderDetailPriceGroup/' + OrderID;
    return this.http.get(this.url);
  }

  AddOrderDetailPriceGroup(data) {
    this.url = this.baseurl + 'api/POS/OrderDetailPriceGroup/AddOrderDetailPriceGroup';
    return this.http.post(this.url, data);
  }

  UpdateOrderDetailPriceGroup(data) {
    this.url = this.baseurl + 'api/POS/OrderDetailPriceGroup/UpdateOrderDetailPriceGroup';
    return this.http.post(this.url, data);
  }

  DeleteOrderDetailPriceGroupByID(ID, TableName, DeletedBy) {
    this.url = this.baseurl + 'api/SHARED/DeleteRecords/DeleteRecordsBYID/' + ID + '/' + TableName + '/' + DeletedBy;
    return this.http.post(this.url, null);
  }
  //LBS_SOP_SalesOrderDetailPriceScheme End

  //LBS_SOP_SalesOrderDetailProductMatrix
  getSalesOrderProductMatrixByRecID(OrderDetailID, ProductID) {
    this.url = this.baseurl + 'api/POS/OrderDetailProductStyleMatrix/GetOrderDetailProductStyleMatrix/' + OrderDetailID + '/' + ProductID;
    return this.http.get(this.url);
  }

  updateSalesOrderProductStyleMatrixList(data) {
    this.url = this.baseurl + 'api/POS/OrderDetailProductStyleMatrix/UpdateSalesOrderProductStyleMatrixList';
    return this.http.post(this.url, data);
  }
  GetShift(CompanyID) {
    this.url = this.baseurl + 'api/POS/Shift/GetCurrentShiftf/' + CompanyID;
    return this.http.get(this.url);
  }
  getUnitPrice(DebtorID, ProductID) {
    this.url = this.baseurl + 'api/POS/OrderDetail/GetUnitPrice/' + DebtorID + '/' + ProductID;
    return this.http.get(this.url);
  }
  getProductDetails(ID) {
    this.url = this.baseurl + 'api/POS/OrderDetail/GetProductDetails/' + ID ;
    return this.http.get(this.url);
  }
  getProductDetailByProductID(ProductID) {
    this.url = this.baseurl + 'api/POS/OrderDetail/GetProductDetailByProductID/' + ProductID ;
    return this.http.get(this.url);
  }
  getTenderTypes(CompanyID){
    this.url = this.baseurl + 'api/POS/OrderDetail/GetTenderType/' + CompanyID ;
    return this.http.get(this.url);
  }
  getTenderTypeByID(tenderTypeId){
    this.url = this.baseurl + 'api/POS/OrderDetail/GetTenderTypeByID/' + tenderTypeId ;
    return this.http.get(this.url);
  }

  SaveOrderDetails(data) {
    this.url = this.baseurl + 'api/POS/OrderDetail/SaveOrderDetails';
    return this.http.post(this.url, data);
  }
  getUnitCost(DebtorID, ProductID) {
    this.url = this.baseurl + 'api/POS/OrderDetail/GetUnitCost/' + DebtorID + '/' + ProductID;
    return this.http.get(this.url);
  }
  getProductStyleMatrix(CompanyID,ProductID,WarehouseID) {
    this.url = this.baseurl + 'api/POS/OrderDetailProductStyleMatrix/GetProductStyleMatrix/' + CompanyID + '/' + ProductID + '/' + WarehouseID;
    return this.http.get(this.url);
  }
  getKitItemByID(ProductID){
    this.url = this.baseurl + 'api/POS/OrderDetailProductStyleMatrix/GetKitItemByID/' + ProductID ;
    return this.http.get(this.url);
  }
  addReceptMain(data) {
    debugger
    this.url = this.baseurl + 'api/POS/OrderDetail/AddReceptMain';
    return this.http.post(this.url, data);
  }
  AddReceptDetails(data) {
    debugger
    this.url = this.baseurl + 'api/POS/OrderDetail/AddReceptDetails';
    return this.http.post(this.url, data);
  }
}

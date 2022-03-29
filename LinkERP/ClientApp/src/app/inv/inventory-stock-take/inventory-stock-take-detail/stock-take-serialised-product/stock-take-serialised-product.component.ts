import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InventoryAdjustmentDetailService } from 'src/app/inv/services/inventory-adjustment-detail.service';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { WareHouseBinService } from 'src/app/inv/services/ware-house-bin.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { BsModalService, BsDatepickerConfig, BsModalRef } from 'ngx-bootstrap';
import { formatDate } from '@angular/common';
import { InventoryStockTakeDetailProductStyleMatrixService } from 'src/app/inv/services/inventory-stock-take-detail-product-style-matrix.service';
import { InventoryService } from 'src/app/inv/services/inventory.service';

@Component({
  selector: 'app-stock-take-serialised-product',
  templateUrl: './stock-take-serialised-product.component.html',
  styleUrls: ['./stock-take-serialised-product.component.css']
})
export class StockTakeSerialisedProductComponent implements OnInit {


  @Input() ProductID: any;
  @Input() SelecteWareHouseID: any;
  @Input() SelectedQuantity: any;
  @Input() StockTakeNo: any;
  @Input() SelectedStockTakeDetailID: any;
  @Output() OnCancel = new EventEmitter();
  @Input() StockTakeStatus: any;
  InventoryAdjustmentSerialTrackingForm: FormGroup;
  BinList: any;
  WareHouseBinList: any;
  SerialList: any;
  totalQuantity: number;
  datePickerConfig: Partial<BsDatepickerConfig>
  modalRef: BsModalRef;
  RowData: any;
  submitted: boolean;
  IsuseExpiryDates: boolean;
  rowinserted: boolean = false;
  ColumnName: any = '-1';
  constructor(private FB: FormBuilder, private toastr: ToastrService, private StockTakeProductStyleMatrixService: InventoryStockTakeDetailProductStyleMatrixService, private wareHouseBinService: WareHouseBinService, private invCommonService: InvCommonService, private deleteRecordsService: DeleteRecordsService, private inventoryService: InventoryService, public modalService: BsModalService) { this.datePickerConfig = Object.assign({}, { dateInputFormat: 'YYYY-MM-DD', showWeekNumbers: false }); }

  ngOnInit() {
    this.BindWareHouseBins();
    this.BindInventoryStockTakeDetails();
    this.CheckInventory();
  }
  CheckInventory() {
    this.inventoryService.getInventoryByID(this.ProductID).subscribe((resp: any) => {
      if (resp.isSuccess) {
        console.log(resp.data.inventorydetails.useExpiryDates);
        if (resp.data.inventorydetails.useExpiryDates) {
          this.IsuseExpiryDates = true;
        } else {
          this.IsuseExpiryDates = false;
        }
      }
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  CreateSerialTrackingForm() {
    debugger;
    let d = formatDate(new Date(), 'yyyy/MM/dd', 'en');
    this.InventoryAdjustmentSerialTrackingForm = this.FB.group({
      BulkNo: ['-1'],
      Cost: [''],
      Quantity: [this.SelectedQuantity],
      SerialNo: [''],
      StartNo: [''],
      PurchaseDate: [d],
      QtyPerLine: [1]
    })
  }
  BindInventoryStockTakeDetails() {

    this.StockTakeProductStyleMatrixService.getInventoryStockTakeDetailForSerlaisedProduct(this.ProductID, this.SelecteWareHouseID, this.SelectedStockTakeDetailID, localStorage.getItem('CompanyID'), this.StockTakeNo).subscribe((resp: any) => {
      this.submitted = false;
      console.log(resp.data)
      this.RowData = resp.data.stockTakeDetail;
      this.totalsum();
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  // BindWareHouseBins() { 
  //   this.wareHouseBinService.getWareHouseBinByWareHouseID(this.SelecteWareHouseID).subscribe((resp: any) => {
  //     this.BinList = resp.data.warehousebin;
  //   }, (error) => {
  //     console.error('Problem with the sevice. Please try later : ' + error);
  //   });
  // }
  BindWareHouseBins() {
    debugger;
    this.invCommonService.getWareHouseBinByWareHouseID(this.SelecteWareHouseID).subscribe((resp: any) => {
      this.WareHouseBinList = resp.data.warehousebin;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  addnew() {
    let ExpiryDate=null;
    if(this.IsuseExpiryDates){
      ExpiryDate=new Date();
    }else{
      ExpiryDate=null;
    }

    debugger;
    let indexx = this.WareHouseBinList.findIndex(c => c.default == true|| c.default=="true");
    let  BinID='00000000-0000-0000-0000-000000000000';
     if(indexx!=-1 || indexx!='-1'){
       BinID= this.WareHouseBinList[indexx].id;
        }
    
    let object = {
      'companyID': localStorage.getItem('CompanyID'),
      'stockTakeNo': this.StockTakeNo,
      'productID': this.ProductID,
      'binID': BinID,
      'productMatrixRow': null,
      'productMatrixColumn': null,
      'serialNo': null,
      'sourceReference': null,
      'transactionDateIn':  new Date(Date.now()),
      'expiryDate': ExpiryDate,
      'stockTakeDetailID': this.SelectedStockTakeDetailID,
      'stockAllocationDetailID': null,
      'currentAvailableQuantity': 0,
      'countQuantity': 0,
      'varianceQuantity': 0,
      'productCode': null,
      'productName': null,
      'binCode': null,
      'binName': '',
      'styleMatrixCode': null,
      'styleMatrixName': null,
      'stockTakeStatus': null,
      'id': null,
      'createdBY': localStorage.getItem('LoginID'),
      'dateCreated': "0001-01-01T00:00:00",
      'deleted': false,
      'deletedBy': null,
      'deleteDate': "0001-01-01T00:00:00",
      'deleteStatus': null,
      'rowinserted': true
    }
    this.RowData.push(object);
    this.rowinserted = true;
  }
  Cancel() {
    this.OnCancel.emit();
    this.submitted = false;
  }
  UpdateChanges(From) {
    this.submitted = true;
    this.StockTakeProductStyleMatrixService.UpdateStockTakeDetailStyleMatrixList(this.RowData).subscribe((resp: any) => {
      /*  */
      if (resp.isSuccess == true) {
        this.toastr.success('stock take details Saved successfully');
        console.log(resp.data.inventorytransferdetail);
        if (From == 'Close') {
          this.OnCancel.emit();
        }
        this.BindInventoryStockTakeDetails();
      }
      else {
        this.submitted = false;
        this.toastr.warning(resp.message);
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  Deleteindex(i, isInserted, countQuantity, rowinserted) {
    debugger;
    if (rowinserted && (countQuantity == 0 || countQuantity == null)) {
      this.RowData.splice(i, 1);
      this.rowinserted = false;
    }
    else {

    }
  }
  DeleteInventorystocktakeDeatilMatrix(ID) {
    debugger;
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_INV_InventoryStockTakeDetailProductStyleMatrix', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.BindInventoryStockTakeDetails();
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  totalsum() {
    this.totalQuantity = this.RowData.reduce((sum, item) => sum + parseInt(item.countQuantity), 0);
  }
  onSearchChange(searchValue, i): void {
    if (!searchValue) {
      this.RowData[i].quantity = 0;
    }
    this.totalsum();
  }
  onColumnNameSelected(event) {
    debugger;
    this.ColumnName = event;
    this.StockTakeProductStyleMatrixService.SortColumns(this.ProductID, this.SelecteWareHouseID, this.SelectedStockTakeDetailID, localStorage.getItem('CompanyID'), this.StockTakeNo, this.ColumnName).subscribe((resp: any) => {
      this.RowData = resp.data.sortedColumns;
      console.log(resp.data.sortedColumns);
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
}

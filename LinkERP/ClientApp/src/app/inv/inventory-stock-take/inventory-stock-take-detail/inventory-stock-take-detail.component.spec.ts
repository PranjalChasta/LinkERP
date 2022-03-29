import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { InventoryAdjustmentDetailService } from 'src/app/inv/services/inventory-adjustment-detail.service';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { WareHouseBinService } from 'src/app/inv/services/ware-house-bin.service';
import { InventoryStockTakeDetailService } from 'src/app/inv/services/inventory-stock-take-detail.service';
import { InventoryStockTakeDetailProductStyleMatrixService } from 'src/app/inv/services/inventory-stock-take-detail-product-style-matrix.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { InventoryService } from 'src/app/inv/services/inventory.service';

@Component({
  selector: 'app-stock-take-style-matrix-row',
  templateUrl: './stock-take-style-matrix-row.component.html',
  styleUrls: ['./stock-take-style-matrix-row.component.css']
})
export class StockTakeStyleMatrixrowComponent implements OnInit {
  @Input() ProductID: any;
  @Input() SelecteWareHouseID: any;
  @Input() SelectedQuantity: any;
  @Input() StockTakeNo: any;
  @Input() StockTakeStatus: any;
  @Output() OnCancel = new EventEmitter();
  @Input() SelectedStockTakeDetailID: any;
  BinList: any;
  totalQuantity: number;
  ProductStyleMatrixRow: any;
  ProductStyleMatrixColumn: any;
  StockTakeDetailProductStyleMatrix: any;
  Resultlist: any;
  SelectedRowID: any;
  filterargs: any;
  RowData: any;
  submitted: boolean;
  IsuseExpiryDates: boolean;
  ColumnName;
  RowName;
  datePickerConfig: Partial<BsDatepickerConfig>
  rowinserted: boolean = false;
  ColName: any = '-1';
  constructor(private toastr: ToastrService, private _inventoryStockTakeDetailService: InventoryStockTakeDetailService, private StockTakeProductStyleMatrixService: InventoryStockTakeDetailProductStyleMatrixService, private inventoryService: InventoryService, private deleteRecordsService: DeleteRecordsService, private invCommonService: InvCommonService, private wareHouseBinService: WareHouseBinService) { this.datePickerConfig = Object.assign({}, { dateInputFormat: 'YYYY-MM-DD', showWeekNumbers: false }); }

  ngOnInit() {
    this.StockTakeDetailProductStyleMatrix = [];
    this.BindWareHouseBins();
    this.BindInventoryStockTakeDetails();
    this.getAdjustmentProductMatrixByRecID();
    this.CheckInventory();
    this.SelectedRowID = '';
    this.filterargs = { 'productMatrixRow': '' };
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
  BindWareHouseBins() {
    debugger;
    this.invCommonService.getWareHouseBinByWareHouseID(this.SelecteWareHouseID).subscribe((resp: any) => {
      this.BinList = resp.data.warehousebin;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindInventoryStockTakeDetails() {
    this.StockTakeProductStyleMatrixService.getStockTakeProductStyleMatrixByID(this.ProductID, this.SelecteWareHouseID, this.SelectedStockTakeDetailID, localStorage.getItem('CompanyID'), this.StockTakeNo).subscribe((resp: any) => {
      console.log(resp.data.stockTakeDetail)
      this.RowData = resp.data.stockTakeDetail;
      this.submitted = false;
      this.totalsum();
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindWareHouseBinsild() {
    this.wareHouseBinService.getWareHouseBinByWareHouseID(this.SelecteWareHouseID).subscribe((resp: any) => {
      this.BinList = resp.data.warehousebin;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  getAdjustmentProductMatrixByRecID() {
    this._inventoryStockTakeDetailService.GetStockTakeProductMatrixByRecID(this.ProductID, this.SelectedStockTakeDetailID).subscribe((resp: any) => {
      debugger;
      this.Resultlist = [];
      this.ProductStyleMatrixRow = resp.data.adjustmentSerlised.productStyleMatrixRow;
      this.ProductStyleMatrixColumn = resp.data.adjustmentSerlised.productStyleMatrixColumn;
      this.StockTakeDetailProductStyleMatrix = resp.data.adjustmentSerlised.inventoryStockTakeDetailProductStyleMatrix;
      if (this.ProductStyleMatrixRow.length > 0) {
        this.RowName = this.ProductStyleMatrixRow[0].styleMatrixDetailCode
      }
      if (this.ProductStyleMatrixColumn.length > 0) {
        this.ColumnName = this.ProductStyleMatrixColumn[0].styleMatrixDetailCode
      }
      console.log("row")
      console.log(this.ProductStyleMatrixRow)
      console.log("column")
      console.log(this.ProductStyleMatrixColumn)
      console.log(resp.data.adjustmentSerlised);

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  UpdateChanges(From) {
    this.submitted = true;
    this.StockTakeProductStyleMatrixService.UpdateStockTakeDetailStyleMatrixList(this.RowData).subscribe((resp: any) => {
      console.log(resp.data.inventorytransferdetail);
      if (resp.isSuccess) {
        this.toastr.success('stock take details Saved successfully');

        if (From == 'Close') {
          this.OnCancel.emit();
        }
        this.BindInventoryStockTakeDetails();
      }
      else {
        this.toastr.error(resp.message);
        this.submitted = false;
      }

    }, (error) => {
      this.submitted = false;
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  Deleteindex(i, isInserted) {
    debugger;
    if(isInserted){
    this.RowData.splice(i, 1);
      this.totalsum();
      this.rowinserted = false;
    }
    else{

    }
  }
  DeleteInventorystocktakeDeatilMatrix(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_INV_InventoryStockTakeDetailProductStyleMatrix', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.BindInventoryStockTakeDetails();
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onSearchChange(searchValue, i): void {
    if (!searchValue) {
      this.RowData[i].countQuantity = 0;
    }
    this.totalsum();
  }
  totalsum() {
    this.totalQuantity = this.RowData.reduce((sum, item) => sum + parseInt(item.countQuantity), 0);
  }
  Cancel() {
    this.submitted = false;
    this.OnCancel.emit();
  }
  addnew() {
    let ExpiryDate=null;
    if(this.IsuseExpiryDates){
      ExpiryDate=new Date();
    }else{
      ExpiryDate=null;
    }
    let object = {
      'companyID': localStorage.getItem('CompanyID'),
      'stockTakeNo': this.StockTakeNo,
      'productID': this.ProductID,
      'binID': '',
      'productMatrixRow': '',
      'productMatrixColumn': '',
      'stockTakeDetailID': this.SelectedStockTakeDetailID,
      'stockAllocationDetailID': null,
      'serialNo': null,
      'sourceReference': null,
      'transactionDateIn': new Date(Date.now()),
      'expiryDate': ExpiryDate,
      'currentAvailableQuantity': 0,
      'countQuantity': 0,
      'varianceQuantity': 0,
      'productCode': null,
      'productName': null,
      'binCode': null,
      'binName': null,
      'styleMatrixCode': null,
      'styleMatrixName': null,
      'stockTakeStatus': null,
      'id': null,
      'createdBY': localStorage.getItem('LoginID'),
      'dateCreated': "0001-01-01T00:00:00",
      'deleted': false,
      'deletedBy': null,
      'deleteDate': "0001-01-01T00:00:00",
      'deleteStatus': null
    }
    this.RowData.push(object);
    this.rowinserted = true;
  }
  onColumnNameSelected(event) {
    debugger;
    this.ColName = event;
    this.StockTakeProductStyleMatrixService.SortMatrixColumns(this.ProductID, this.SelecteWareHouseID, this.SelectedStockTakeDetailID, localStorage.getItem('CompanyID'), this.StockTakeNo, this.ColName).subscribe((resp: any) => {
      this.RowData = resp.data.sortedColumns;
      console.log(resp.data.sortedColumns);
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
}

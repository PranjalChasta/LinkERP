import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InventoryStockTakeDetailProductStyleMatrixService } from 'src/app/inv/services/inventory-stock-take-detail-product-style-matrix.service';
import { WareHouseBinService } from 'src/app/inv/services/ware-house-bin.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { BsModalService, BsDatepickerConfig } from 'ngx-bootstrap';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { CustomValidators } from 'ngx-custom-validators';
import { InventoryService } from 'src/app/inv/services/inventory.service';

@Component({
  selector: 'app-stock-take-other',
  templateUrl: './stock-take-other.component.html',
  styleUrls: ['./stock-take-other.component.css']
})
export class StockTakeOtherComponent implements OnInit {
  InventoryStockTakeOther: FormGroup;
  @Input() ProductID: any;
  @Input() SelecteWareHouseID: any;
  @Input() SelectedQuantity: any;
  @Input() StockTakeNo: any;
  @Input() SelectedStockTakeDetailID: any;
  @Output() OnCancel = new EventEmitter();
  @Input() StockTakeStatus: any;
  IsuseExpiryDates: boolean;
  RowData:any;
  CompanyID = localStorage.getItem('CompanyID');
  submitted: boolean;
  WareHouseBinList: any;
  totalQuantity: any;
  datePickerConfig: Partial<BsDatepickerConfig>
  ColumnName: any = '-1';
  rowinserted: boolean = false;
  constructor(private FB: FormBuilder, private toastr: ToastrService,
    private invCommonService: InvCommonService, private inventoryService: InventoryService,
    private StockTakeProductStyleMatrixService: InventoryStockTakeDetailProductStyleMatrixService, private wareHouseBinService: WareHouseBinService, private deleteRecordsService: DeleteRecordsService, public modalService: BsModalService) { this.datePickerConfig = Object.assign({}, { dateInputFormat: 'YYYY-MM-DD', showWeekNumbers: false }); }

  ngOnInit() {
    this.CreateForm();
    this.CheckInventory();
    this.BindWareHouseBins();

  }
  get f() { return this.InventoryStockTakeOther.controls; }
  CreateForm() {
    this.InventoryStockTakeOther = this.FB.group({
      ID: [''],
      CompanyID: [this.CompanyID],
      StockTakeNo: [''],
      BinID: ['', CustomValidators.notEqual('')],
      CountQuantity: [''],
      BinIDStart: ['']
    });
  }
  CheckInventory() {
    this.inventoryService.getInventoryByID(this.ProductID).subscribe((resp: any) => {
      this.BindInventoryStockTakeDetails();
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
  /* BindInventoryStockTakeDetails() { 
    this.StockTakeProductStyleMatrixService.getStockTakeProductStyleMatrixByID(this.ProductID, this.SelecteWareHouseID,this.SelectedStockTakeDetailID, localStorage.getItem('CompanyID'), this.StockTakeNo).subscribe((resp: any) => {
      console.log(resp.data.stockTakeDetail)
      if(resp.data.stockTakeDetail.length>0){
        let event = resp.data.stockTakeDetail[0];   
        this.InventoryStockTakeOther.patchValue({
          ID: event.id,
          CompanyID: event.companyID,
          StockTakeNo: event.stockTakeNo,
          BinID: event.binID,
          CountQuantity: event.countQuantity, 
        });
      }
    
    }, (error) => { 
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  } */
  BindInventoryStockTakeDetails() {
    this.StockTakeProductStyleMatrixService.getInventoryStockTakeDetailForOtherProduct(this.ProductID, this.SelecteWareHouseID, this.SelectedStockTakeDetailID, localStorage.getItem('CompanyID'), this.StockTakeNo).subscribe((resp: any) => {
      console.log(resp.data)
      this.RowData = resp.data.stockTakeDetail;
      //for bug Bug #1213
      if (this.IsuseExpiryDates) {
        this.RowData.forEach(element => {
          if (element.expiryDate == null || element.expiryDate == "null") {
            element.expiryDate = new Date();
          }
        });
      }
      this.submitted = false;
      this.totalsum();
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindWareHouseBins() {
    debugger;
    this.invCommonService.getWareHouseBinByWareHouseID(this.SelecteWareHouseID).subscribe((resp: any) => {
      this.WareHouseBinList = resp.data.warehousebin;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onSave(Saveaction) {
    this.submitted = true;
    if (this.InventoryStockTakeOther.invalid) {
      return;
    }

    this.RowData = [];
    console.log("123")
    let object = {
      'companyID': localStorage.getItem('CompanyID'),
      'stockTakeNo': this.StockTakeNo,
      'productID': this.ProductID,
      'binID': this.InventoryStockTakeOther.get('BinID').value,
      'productMatrixRow': null,
      'productMatrixColumn': null,
      'serialNo': null,
      'sourceReference': this.StockTakeNo,
      'transactionDateIn': null,
      'expiryDate': null,
      'stockTakeDetailID': this.SelectedStockTakeDetailID,
      'stockAllocationDetailID': null,
      'currentAvailableQuantity': this.InventoryStockTakeOther.get('CountQuantity').value,
      'countQuantity': this.InventoryStockTakeOther.get('CountQuantity').value,
      'varianceQuantity': this.InventoryStockTakeOther.get('CountQuantity').value,
      'productCode': null,
      'productName': null,
      'binCode': null,
      'binName': null,
      'styleMatrixCode': null,
      'styleMatrixName': null,
      'stockTakeStatus': null,
      'id': this.InventoryStockTakeOther.get('ID').value,
      'createdBY': localStorage.getItem('LoginID'),
      'dateCreated': "0001-01-01T00:00:00",
      'deleted': false,
      'deletedBy': null,
      'deleteDate': "0001-01-01T00:00:00",
      'deleteStatus': null
    }
    this.RowData.push(object);
    this.StockTakeProductStyleMatrixService.UpdateStockTakeDetailStyleMatrixList(this.RowData).subscribe((resp: any) => {
      this.toastr.success('stock take details Saved successfully');
      console.log(resp.data.inventorytransferdetail);
      if (Saveaction == 'Close') {
        this.OnCancel.emit();
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
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
  Deleteindex(i, isInserted, countQty) {
    debugger;
    if (isInserted && (countQty == 0 || countQty == null)) {
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

  onSearchChange(searchValue, i): void {
    this.totalsum();
  }
  totalsum() {
    this.totalQuantity = this.RowData.reduce((sum, item) => sum + parseInt(item.countQuantity), 0);
  }
  addnew() {
    let ExpiryDate=null;
    if(this.IsuseExpiryDates){
      ExpiryDate=new Date();
    }else{
      ExpiryDate=null;
    }
    let indexx = this.WareHouseBinList.findIndex(c => c.default == true|| c.default=="true");
    let  BinID='00000000-0000-0000-0000-000000000000';
     if(indexx!=-1 || indexx!='-1'){
       BinID= this.WareHouseBinList[indexx].id;
        }
    


    let object = {
      'companyID': localStorage.getItem('CompanyID'),
      'stockTakeNo': this.StockTakeNo,
      'productID': this.ProductID,
      'binID':BinID,
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

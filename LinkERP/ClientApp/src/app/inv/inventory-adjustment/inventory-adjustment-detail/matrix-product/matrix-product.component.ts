import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { InventoryAdjustmentDetailService } from 'src/app/inv/services/inventory-adjustment-detail.service';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { WareHouseBinService } from 'src/app/inv/services/ware-house-bin.service';
import { InvProductStyleMatrix, ProductStyleMatrixColumn, MatrixDetail } from 'src/app/models/inv/inv-ProductStyleMatrix'
import { from } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { InventoryService } from 'src/app/inv/services/inventory.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
@Component({
  selector: 'app-matrix-product',
  templateUrl: './matrix-product.component.html',
  styleUrls: ['./matrix-product.component.css']
})
@Pipe({
  name: 'myfilter',
  pure: false
})
export class MatrixProductComponent implements OnInit {
  @Input() AdjustmentID: any;
  @Input() ProductID: any;
  @Input() CurrentStatus: string;
  @Input() SelectedAdjustmentDetail_ID: any;
  @Input() SelecteWareHouseID: any;
  @Input() SelectedQuantity: any;
  @Input() SelectedProductCode: any;
  @Input() SelectedProductDescription: any;
  @Output() OnCancel = new EventEmitter();
  BinList: any;
  totalQuantity: number;
  ProductStyleMatrixRow: any;
  ProductStyleMatrixColumn: any;
  AdjustmentDetailProductStyleMatrix: any;
  Resultlist: any;
  SelectedRowID: any;
  filterargs: any;
  selectedRow: boolean[] = [];
  submitted: boolean;
  IsuseExpiryDates: boolean;
  ColumnName;
  RowName;
  datePickerConfig: Partial<BsDatepickerConfig>
  Msg: string;
  constructor(private toastr: ToastrService, private adjustmentdetailService: InventoryAdjustmentDetailService, private inventoryService: InventoryService, private invCommonService: InvCommonService, private wareHouseBinService: WareHouseBinService,) {
    this.datePickerConfig = Object.assign({}, { dateInputFormat: 'YYYY-MM-DD', showWeekNumbers: false });
  }

  ngOnInit() {
    this.submitted = false;
    this.CheckInventory();
    this.BindWareHouseBins();

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
  BindWareHouseBinsold() {
    this.wareHouseBinService.getWareHouseBinByWareHouseID(this.SelecteWareHouseID).subscribe((resp: any) => {
      this.BinList = resp.data.warehousebin;
      this.getAdjustmentProductMatrixByRecID();
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindWareHouseBins() {
    debugger;
    this.invCommonService.getWareHouseBinByWareHouseID(this.SelecteWareHouseID).subscribe((resp: any) => {
      this.BinList = resp.data.warehousebin;
      this.getAdjustmentProductMatrixByRecID();

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  getAdjustmentProductMatrixByRecID() {
    this.adjustmentdetailService.getAdjustmentProductMatrixByRecID(this.ProductID, this.SelectedAdjustmentDetail_ID).subscribe((resp: any) => {
      debugger;
      this.Resultlist = [];
      this.ProductStyleMatrixRow = resp.data.adjustmentSerlised.productStyleMatrixRow;
      this.ProductStyleMatrixColumn = resp.data.adjustmentSerlised.productStyleMatrixColumn;
      this.AdjustmentDetailProductStyleMatrix = resp.data.adjustmentSerlised.inventoryAdjustmentDetail_ProductStyleMatrix;

      this.AdjustmentDetailProductStyleMatrix.forEach(obj => {
        if (this.BinList) {
          let Defaultbin = this.BinList.filter(r => r.default == true)[0];
          if (Defaultbin != null) {
            obj.binID = obj.binID == null ? Defaultbin.id : obj.binID;
          }
        }
      });


      if (this.ProductStyleMatrixRow.length == 0 && this.ProductStyleMatrixColumn.length == 0) {
        this.Msg = "Please select product style matrix row and column";
      }
      if (this.ProductStyleMatrixRow.length > 0) {
        this.RowName = this.ProductStyleMatrixRow[0].styleMatrixDetailCode
      }
      if (this.ProductStyleMatrixColumn.length > 0) {
        this.ColumnName = this.ProductStyleMatrixColumn[0].styleMatrixDetailCode
      }
      console.log(resp.data.adjustmentSerlised);
      if (this.ProductStyleMatrixRow.length > 0) {
        for (let i = 0; i < this.ProductStyleMatrixRow.length; i++) {
          this.myFunc(this.ProductStyleMatrixRow[i].id, i)
        }
        this.myFunc(this.ProductStyleMatrixRow[0].id, 0)
      }
      this.submitted = false;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }


  UpdateChanges(From) {
    console.log(this.Resultlist)
    debugger;
    this.submitted = true;
    if (parseInt(this.SelectedQuantity) == this.totalQuantity) {
      this.Resultlist.foreach
      this.Resultlist.forEach(obj => {
        if (obj.binID == "null") {
          obj.binID = null;
        }
      });

      this.adjustmentdetailService.updateInventoryAdjustmentProductStyleMatrixList(this.Resultlist).subscribe((resp: any) => {

        this.getAdjustmentProductMatrixByRecID();
        this.toastr.success('Adjustment Detail details Saved successfully');
        // this.submitted = false;
        if (From == 'Close') {
          this.OnCancel.emit();
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    } else {
      this.toastr.warning('Total quantity should match with converted quantity (' + this.SelectedQuantity + ')');
      this.submitted = false;
    }

  }

  myFunc(id, index) {
    debugger;
    this.selectedRow = [];
    this.selectedRow[index] = true;
    this.SelectedRowID = id;
    let Checkindex = this.Resultlist.findIndex(c => c.productMatrixRow == id);
    if (Checkindex < 0) {
      for (let i = 0; i < this.ProductStyleMatrixColumn.length; i++) {
        let TempResultlist = this.AdjustmentDetailProductStyleMatrix.filter(item => item['productMatrixRow'] === id && item['productMatrixColumn'] === this.ProductStyleMatrixColumn[i].id && item['adjustmentDetail_ID'] === this.SelectedAdjustmentDetail_ID);
          
        let Binid = null;
        let Quantity = 0;
        let Pid = "";
        let ExpDate = "";
        let TDate = new Date();
        if (TempResultlist.length > 0) {
          Binid = TempResultlist[0].binID;
          Quantity = TempResultlist[0].quantity;
          Pid = TempResultlist[0].id;
          ExpDate = TempResultlist[0].expiryDate;
          TDate = TempResultlist[0].transactionDateIn == null ? new Date() : TempResultlist[0].transactionDateIn
        }
        let object = {
          'companyID': localStorage.getItem('CompanyID'),
          'adjustmentID': this.AdjustmentID,
          'adjustmentDetail_ID': this.SelectedAdjustmentDetail_ID,
          'productID': this.ProductID,
          'binID': Binid = null ? '00000000-0000-0000-0000-000000000000' : Binid,
          'productMatrixRow': id,
          'productMatrixColumn': this.ProductStyleMatrixColumn[i].id,
          'serialNo': null,
          'sourceReference': null,
          'transactionDateIn': TDate, /*TempResultlist == null ? new Date() : (TempResultlist[0].transactionDateIn == null ? new Date() : TempResultlist[0].transactionDateIn),*/
          'styleMatrixDetailName': this.ProductStyleMatrixColumn[i].styleMatrixDetailName,
          'expiryDate': ExpDate,
          'quantity': Quantity,
          'styleMatrixName': "Size",
          'refId': null,
          'id': Pid,
          'createdBY': null,
          'dateCreated': "0001-01-01T00:00:00",
          'deleted': false,
          'deletedBy': null,
          'deleteDate': "0001-01-01T00:00:00",
          'deleteStatus': null
        }
        this.Resultlist.push(object);
        

      }
      this.Resultlist.forEach(obj => {
        if (this.BinList) {
          let Defaultbin = this.BinList.filter(r => r.default == true)[0];
          if (Defaultbin != null) {
            obj.binID = obj.binID == null ? Defaultbin.id : obj.binID;
          }
        }
      });
      this.totalsum();
    }
  }
  onSearchChange(searchValue, i): void {
    if (!searchValue) {
      this.Resultlist[i].quantity = 0;
    }
    this.totalsum();
  }
  totalsum() {
    this.totalQuantity = this.Resultlist.reduce((sum, item) => sum + parseInt(item.quantity), 0);
  }
  Cancel() {
    this.OnCancel.emit();
    this.submitted = false;
  }
}

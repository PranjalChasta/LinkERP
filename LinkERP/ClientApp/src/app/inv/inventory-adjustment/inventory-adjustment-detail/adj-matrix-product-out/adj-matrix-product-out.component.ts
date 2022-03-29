import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { WareHouseBinService } from 'src/app/inv/services/ware-house-bin.service';
import { InventoryAdjustmentDetailService } from 'src/app/inv/services/inventory-adjustment-detail.service';
import { InventoryStockAllocationDetailsService } from 'src/app/inv/services/inventory-stock-allocation-details.service';

@Component({
  selector: 'app-adj-matrix-product-out',
  templateUrl: './adj-matrix-product-out.component.html',
  styleUrls: ['./adj-matrix-product-out.component.css']
})
export class AdjMatrixProductOutComponent implements OnInit {

  @Input() AdjustmentID: any;
  @Input() ProductID: any;
  @Input() SelectedAdjustmentDetail_ID: any;
  @Input() SelecteWareHouseID: any;
  @Input() SelectedQuantity: any;
  @Input() SelectedProductCode: any;
  @Input() SelectedProductDescription: any;
  @Output() OnCancel = new EventEmitter();
  @Input() CurrentStatus: string;
  SerialListOut: any;
  adjQty = [];
  BinList: any;
  totalAdjQty = 0;
  InvAdjDetSerialListOut: any = [];
  colName: any = '-1';
  ColumnName;
  RowName;
  constructor(private toastr: ToastrService,
    private wareHouseBinService: WareHouseBinService,
    private adjustmentdetailService: InventoryAdjustmentDetailService,
    private adjustmentdetailStockOutService: InventoryStockAllocationDetailsService) { }

  ngOnInit() {
    this.getAdjustmentSerlisedOutByRecID();
  }


  getAdjustmentSerlisedOutByRecID() {
    let obj = {
      'companyID': localStorage.getItem('CompanyID'),
      'productID': this.ProductID,
      'warehouseID': this.SelecteWareHouseID,
      'adjustmentRefID': this.SelectedAdjustmentDetail_ID
    }
    this.adjustmentdetailStockOutService.getInventoryStockAllocationBymatrixProduct(obj).subscribe((resp: any) => {
      this.SerialListOut = resp.data.inventorystockallocationdetailsforout;
      if (this.SerialListOut.length > 0) {
        this.ColumnName = this.SerialListOut[0].styleMatrixName;
        this.RowName = this.SerialListOut[0].styleMatrixDetailName;
      }
      console.log(resp.data);

      for (var i = 0; i < this.SerialListOut.length; i++) {
        this.totalsum();
        if (this.SerialListOut[i].binName == undefined) {
          this.SerialListOut[i].binName = 'N/A';
        }

      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  Cancel() {
    this.OnCancel.emit();
  }

  onSearchChange(searchValue, i): void {
    if (!searchValue) {
      this.SerialListOut[i].adjQty = 0;
    } else if (this.SerialListOut[i].quantityOnHand < this.SerialListOut[i].adjQty) {
      this.toastr.warning("Adjustment quantity cannot be greater than Available quantity");
      this.SerialListOut[i].adjQty = 0;
    } else {
      this.SerialListOut[i].adjQty = Number(searchValue);
      this.totalsum();
    }


  }

  totalsum() {
    this.totalAdjQty = this.SerialListOut.reduce((sum, item) => sum + parseInt(item.adjQty), 0);
    console.log(this.totalAdjQty);
  }

  SaveOutStock(From) {

    for (var i = 0; i < this.SerialListOut.length; i++) {

      let object = {
        'id': this.SerialListOut[i].adDetailSrnoId,
        'companyID': localStorage.getItem('CompanyID'),
        'adjustmentID': this.AdjustmentID,
        'AdjustmentDetail_ID': this.SelectedAdjustmentDetail_ID,
        'productID': this.ProductID,
        'binID': this.SerialListOut[i].binID,
        'serialNo': this.SerialListOut[i].serialNo,
        'sourceReference': this.SerialListOut[i].sourceReference,
        'transactionDateIn': this.SerialListOut[i].transactionDateIn,
        'quantity': this.SerialListOut[i].adjQty,
        'refId': this.SerialListOut[i].id
      }
      this.InvAdjDetSerialListOut.push(object);
    }
    console.log(this.InvAdjDetSerialListOut);
    this.adjustmentdetailService.updateInventoryAdjustmentSerlisedListOut(this.InvAdjDetSerialListOut).subscribe((resp: any) => {
      this.toastr.success('Adjustment Detail for out stock Saved successfully');
      this.getAdjustmentSerlisedOutByRecID();
      this.colName = '-1';
      if (From == 'Close') {
        this.OnCancel.emit();
      }
      //this.Cancel();
      //this.RowData = resp.data.inventoryadjustmentdetail;

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onColumnNameSelected(event) {
    debugger;
    this.colName = event;
    let obj = {
      'companyID': localStorage.getItem('CompanyID'),
      'productID': this.ProductID,
      'warehouseID': this.SelecteWareHouseID,
      'adjustmentRefID': this.SelectedAdjustmentDetail_ID,
      'columnName': this.colName
    }
    this.adjustmentdetailStockOutService.matrixSortColumns(obj).subscribe((resp: any) => {
      this.SerialListOut = resp.data.sortedColumns;
      if (this.SerialListOut.length > 0) {
        this.ColumnName = this.SerialListOut[0].styleMatrixName;

        this.RowName = this.SerialListOut[0].styleMatrixDetailName;
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
}

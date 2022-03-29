import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { WareHouseBinService } from 'src/app/inv/services/ware-house-bin.service';
import { InventoryAdjustmentDetailService } from 'src/app/inv/services/inventory-adjustment-detail.service';
import { InventoryStockAllocationDetailsService } from 'src/app/inv/services/inventory-stock-allocation-details.service';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';

@Component({
  selector: 'app-inventoryadtustment-other-out',
  templateUrl: './inventoryadtustment-other-out.component.html',
  styleUrls: ['./inventoryadtustment-other-out.component.css']
})
export class InventoryadtustmentOtherOutComponent implements OnInit {

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
  columnName: any = '-1';
  constructor(private toastr: ToastrService,
    private wareHouseBinService: WareHouseBinService,
    private invCommonService: InvCommonService,
    private adjustmentdetailService: InventoryAdjustmentDetailService,
    private adjustmentdetailStockOutService: InventoryStockAllocationDetailsService) { }

  ngOnInit() {
    this.getAdjustmentSerlisedOutByRecID();
    this.BindWareHouseBins();
  }


  getAdjustmentSerlisedOutByRecID() {
    let obj = {
      'companyID': localStorage.getItem('CompanyID'),
      'productID': this.ProductID,
      'warehouseID': this.SelecteWareHouseID,
      'adjustmentRefID': this.SelectedAdjustmentDetail_ID
    }
    this.adjustmentdetailStockOutService.getInventoryStockAllocationDetailsByProductID(obj).subscribe((resp: any) => {
      this.SerialListOut = resp.data.inventorystockallocationdetailsforout;
debugger;
      console.log(resp.data.inventorystockallocationdetailsforout);

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
  BindWareHouseBins() { 
    this.invCommonService.getWareHouseBinByWareHouseID(this.SelecteWareHouseID).subscribe((resp: any) => {
      this.BinList = resp.data.warehousebin;  
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  addnew() {
let indexx = this.BinList.findIndex(c => c.default == true|| c.default=="true");
let  BinID='00000000-0000-0000-0000-000000000000';
 if(indexx!=-1 || indexx!='-1'){
   BinID= this.BinList[indexx].id;
    }

    let object = {
      'id': '',
      'companyID': localStorage.getItem('CompanyID'),
      'adjustmentID': this.AdjustmentID,
      'AdjustmentDetail_ID': this.SelectedAdjustmentDetail_ID,
      'productID': this.ProductID,
      'binID': BinID,
      'serialNo':null,
      'expiryDate':'',
      'transactionDateIn':  new Date(Date.now()),
      'quantity': 0
    }

    this.InvAdjDetSerialListOut.push(object);
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
      this.columnName = '-1';
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
    this.columnName = event;
    let obj = {
      'companyID': localStorage.getItem('CompanyID'),
      'productID': this.ProductID,
      'warehouseID': this.SelecteWareHouseID,
      'adjustmentRefID': this.SelectedAdjustmentDetail_ID,
      'columnName': this.columnName
    }
    this.adjustmentdetailStockOutService.SortColumns(obj).subscribe((resp: any) => {
      this.SerialListOut = resp.data.sortedColumns;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
}

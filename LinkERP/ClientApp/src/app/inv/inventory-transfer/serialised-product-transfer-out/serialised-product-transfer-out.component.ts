import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { WareHouseBinService } from '../../services/ware-house-bin.service';
import { InventoryTransferDetailService } from '../../services/inventory-transfer-detail.service';
import { InventoryStockAllocationDetailsService } from '../../services/inventory-stock-allocation-details.service';
import { InventoryTransferStatusService } from '../inventory-transfer-status.service';

@Component({
  selector: 'app-serialised-product-transfer-out',
  templateUrl: './serialised-product-transfer-out.component.html',
  styleUrls: ['./serialised-product-transfer-out.component.css']
})
export class SerialisedProductTransferOutComponent implements OnInit {
  @Input() TransferID: any;
  @Input() ProductID: any;
  @Input() SelectedTransferDetail_ID: any;
  @Input() WareHouseFromID: any;
  @Input() WareHouseToID: any;
  @Input() SelectedQuantity: any;
  @Output() OnCancel = new EventEmitter();
  selectedQty = "Requested";
  SerialListOut: any;
  BinList: any;
  totalTransferQty = 0;
  InvTransferDetSerialListOut: any = [];
  qty: any;
  @Input() RequestedQuantity: any;
  columnName: any = '-1';
  constructor(private toastr: ToastrService,
    private wareHouseBinService: WareHouseBinService,
    private transferdetailService: InventoryTransferDetailService,
    private transferdetailStockOutService: InventoryStockAllocationDetailsService, private invStatusService: InventoryTransferStatusService) { }

  ngOnInit() {
    this.getTransferSerlisedOutByRecID();
    this.setQuantity();
  }
  getTransferSerlisedOutByRecIDold() {
    

    this.transferdetailStockOutService.getInventoryStockAllocationForTransfer(localStorage.getItem('CompanyID'),this.ProductID,this.WareHouseFromID,this.SelectedTransferDetail_ID).subscribe((resp: any) => {
      this.IsSubmit=false;
      this.SerialListOut = resp.data.inventorystockallocationdetailsforout;
console.log(this.SerialListOut )
this.totalsum();
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  getTransferSerlisedOutByRecID() {
    let obj = {
      'companyID': localStorage.getItem('CompanyID'),
      'productID': this.ProductID,
      'warehouseID': this.WareHouseFromID,
      'adjustmentRefID': this.SelectedTransferDetail_ID
    } 
    this.transferdetailStockOutService.getInventoryStockAllocationForSerialTransfer(localStorage.getItem('CompanyID'),this.ProductID,this.WareHouseFromID,this.SelectedTransferDetail_ID).subscribe((resp: any) => {
      this.SerialListOut = resp.data.inventorystockallocationdetailsforout;
      this.IsSubmit=false;
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
    this.IsSubmit=false;
    this.OnCancel.emit();
  }

  totalsum() {
    var Jlist = this.SerialListOut.filter(function (e) {return e.shippedQty != null;});
    console.log(Jlist);
    this.totalTransferQty = Jlist.reduce((sum, item) => sum + parseInt(item.shippedQty), 0);
  }

  onSearchChange(searchValue, i) {
    if (!searchValue) {
      this.SerialListOut[i].shippedQty = 0;
      return;
    } else if (this.SerialListOut[i].quantityOnHand < this.SerialListOut[i].shippedQty) {
      this.toastr.warning(this.selectedQty + " quantity cannot be greater than Available quantity");
     // this.SerialListOut[i].shippedQty = 0;
      return;
    } else {
      this.SerialListOut[i].shippedQty = Number(searchValue);
      this.totalsum();
    }
  }
  IsSubmit:boolean;
  SaveOutStock(from) {
    this.IsSubmit=true;
    this.InvTransferDetSerialListOut=[];
    for (var i = 0; i < this.SerialListOut.length; i++) {
      if(this.SerialListOut[i].quantityOnHand < this.SerialListOut[i].shippedQty){
        this.toastr.warning(this.selectedQty + " quantity cannot be greater than Available quantity");
        return;
      }
      let req_qty=0;
      if( this.SerialListOut[i].shippedQty>0){
        req_qty=this.SelectedQuantity;
      }
      let object = {
        'id': this.SerialListOut[i].id,
        'companyID': localStorage.getItem('CompanyID'),
        'transferID': this.TransferID,
        'TransferDetailID': this.SelectedTransferDetail_ID,
        'productID': this.ProductID,
        'binID':  this.SerialListOut[i].binID,
        'serialNo': this.SerialListOut[i].serialNo,
        'sourceReference': this.SerialListOut[i].sourceReference,
        'transactionDateIn': this.SerialListOut[i].transactionDateIn,
        'expiryDate':  this.SerialListOut[i].expiryDate,
        'requestedQty':this.RequestedQuantity,//req_qty, //this.SerialListOut[i].requestedQty,
        'shippedQty': this.SerialListOut[i].shippedQty,
        'receivedQty': this.SerialListOut[i].receivedQty,
      }
      this.InvTransferDetSerialListOut.push(object);
    }
    console.log(this.InvTransferDetSerialListOut);
    this.transferdetailService.updateInventoryTransferSerlisedListOut(this.InvTransferDetSerialListOut).subscribe((resp: any) => {
      this.toastr.success('Transfer Detail for out stock Saved successfully');
      this.columnName = '-1';
      if(from=='Close'){
        this.OnCancel.emit();
      }
      this.getTransferSerlisedOutByRecID();
      //this.Cancel();
      //this.RowData = resp.data.inventoryadjustmentdetail;

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  setQuantity() {
    if (this.invStatusService.status == "Requested") {
      this.selectedQty = "Shipped";
    } else if (this.invStatusService.status == "Shipped") {
      this.selectedQty = "Received";
    }
  }
  onColumnNameSelected(event) {
    debugger;
    this.columnName = event;
    this.transferdetailStockOutService.SortColumnsSerialTransfer(localStorage.getItem('CompanyID'),this.ProductID,this.WareHouseFromID,this.SelectedTransferDetail_ID, this.columnName).subscribe((resp: any) => {
      this.SerialListOut = resp.data.sortColumns;
      this.IsSubmit=false;
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
}

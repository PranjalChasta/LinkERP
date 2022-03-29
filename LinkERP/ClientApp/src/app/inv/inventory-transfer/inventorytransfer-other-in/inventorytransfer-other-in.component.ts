import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { InventoryTransferDetailService } from '../../services/inventory-transfer-detail.service';
import { ToastrService } from 'ngx-toastr';
import { WareHouseBinService } from '../../services/ware-house-bin.service';
import { InventoryTransferStatusService } from '../inventory-transfer-status.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-inventorytransfer-other-in',
  templateUrl: './inventorytransfer-other-in.component.html',
  styleUrls: ['./inventorytransfer-other-in.component.css']
})
export class InventorytransferOtherInComponent implements OnInit {

  @Input() TransferID: any;
  @Input() ProductID: any;
  @Input() SelectedTransferDetail_ID: any;
  @Input() WareHouseFromID: any;
  @Input() WareHouseToID: any;
  @Input() SelectedQuantity: any;
  @Input() Status:any
  @Output() OnCancel = new EventEmitter();
  @Input() CurrentStatus: any;
  selectedQty = "Requested";
  SerialListOut: any;
  BinList: any;
  totalTransferQty = 0;
  InvTransferDetSerialListOut: any = [];
  qty: any;
  SerialList: any;
  totalQuantity=0;
  InventoryTransferSerialTrackingForm: FormGroup;
  datePickerConfig: Partial<BsDatepickerConfig>
  columnName: any = '-1';
  
  constructor(private transferDetailService: InventoryTransferDetailService,
    private FB: FormBuilder,
    private toastr: ToastrService,
    private wareHouseBinService: WareHouseBinService,
    private invTransferStatus:InventoryTransferStatusService
  ) {
    this.datePickerConfig = Object.assign({}, { dateInputFormat: 'YYYY-MM-DD', showWeekNumbers: false });
  }

  ngOnInit() {
    //this.CreateSerialTrackingForm();
    this.BindWareHouseBins();
  //  this.getTransferSerlisedByRecID();
  }
  CreateSerialTrackingForm() {
    let d = formatDate(new Date(), 'yyyy/MM/dd', 'en');
    this.InventoryTransferSerialTrackingForm = this.FB.group({
      BulkNo: ['-1'],
      Cost: [''],
      Quantity: [this.SelectedQuantity],
      SerialNo: [''],
      StartNo: [''],
      PurchaseDate: [d],
      QtyPerLine: [1]
    })
  }

  BindWareHouseBins() {

    this.wareHouseBinService.getWareHouseBinByWareHouseID(this.WareHouseToID).subscribe((resp: any) => {
      this.BinList = resp.data.warehousebin;
      this.getTransferSerlisedByRecID();
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  getTransferSerlisedByRecID() {
    this.transferDetailService.getTransferSerlisedByRecID(this.SelectedTransferDetail_ID).subscribe((resp: any) => {
      this.SerialList = resp.data.transferSerlised;
      this.SerialList.forEach(obj => {
        if (this.BinList) {
          let Defaultbin = this.BinList.filter(r => r.default == true)[0];
          if (Defaultbin != null) {
            obj.binID = obj.binID == null ? Defaultbin.id : obj.binID;
          }
        }            
        });

      console.log(this.SerialList);
      if (this.SerialList.length > 0) {
        this.totalsum();
      }
      console.log(resp.data.transferSerlised);
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  UpdateChanges(from) {
  
    this.transferDetailService.updateInventoryTransferSerlisedList(this.SerialList).subscribe((resp: any) => {
      this.toastr.success('Transfer Details Saved Successfully');
      this.columnName = '-1';
      if(from=='Close'){
        this.OnCancel.emit();
      }
      //this.RowData = resp.data.inventoryadjustmentdetail;

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  onSearchChange(searchValue, id): void {
    if (!searchValue) {
      let index = this.SerialList.findIndex(c => c.id == id);
      this.SerialList[index].receivedQty = 0;
    }
    this.totalsum();
  }
  onSearchreceiveChange(searchValue,id,indexx){
console.log(searchValue,id);
    if (!searchValue) {
      let index = this.SerialList.findIndex(c => c.id == id);
      this.SerialList[index].receivedQty = 0;
    }
   let preRcvqty=0;
   if(this.SerialList[indexx].previouslyReceviedQty){
    preRcvqty= this.SerialList[indexx].previouslyReceviedQty
   }
   
   let Rcvcqty= this.SerialList[indexx].receivedQty;
   let shippedQty= Number(this.SerialList[indexx].shippedQty);
   let tot=Number(preRcvqty)+(Number(Rcvcqty));
   if(tot>shippedQty){
    this.SerialList[indexx].receivedQty=0;
     this.toastr.warning('Total recevied quantity should be less than shipped quantity'); 
     return;
   }
    this.totalsum();
  }
  totalsum() {
    this.totalQuantity = this.SerialList.reduce((sum, item) => sum + parseInt(item.receivedQty), 0);
  }
  Cancel() {
    this.OnCancel.emit();
  }
  onColumnNameSelected(event) {
    debugger;
    this.columnName = event;

    this.transferDetailService.SortColumns(this.SelectedTransferDetail_ID, this.columnName).subscribe((resp: any) => {
      this.SerialList = resp.data.sortColumns;
      console.log(this.SerialList);
      if (this.SerialList.length > 0) {
        this.totalsum();
      }
      console.log(resp.data.transferSerlised);
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });

  }
}

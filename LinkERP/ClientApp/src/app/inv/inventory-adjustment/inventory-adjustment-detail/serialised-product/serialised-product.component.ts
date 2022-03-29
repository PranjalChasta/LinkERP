import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { BsDatepickerConfig, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { InventoryAdjustmentDetailService } from 'src/app/inv/services/inventory-adjustment-detail.service';
import { formatDate } from '@angular/common';
import { WareHouseBinService } from 'src/app/inv/services/ware-house-bin.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { InventoryStockAllocationDetailsService } from 'src/app/inv/services/inventory-stock-allocation-details.service';


@Component({
  selector: 'app-serialised-product',
  templateUrl: './serialised-product.component.html',
  styleUrls: ['./serialised-product.component.css']
})
export class SerialisedProductComponent implements OnInit {
  @Input() AdjustmentID: any;
  @Input() ProductID: any;
  @Input() CurrentStatus: string;
  @Input() SelectedAdjustmentDetail_ID: any;
  @Input() SelecteWareHouseID: any;
  @Input() SelectedQuantity: any;
  @Input() SelectedProductCode: any;
  @Input() SelectedProductDescription: any;
  @Output() OnCancel = new EventEmitter();
  InventoryAdjustmentSerialTrackingForm: FormGroup;
  BinList: any;
  SerialList: any;
  totalQuantity: number;
  datePickerConfig: Partial<BsDatepickerConfig>
  modalRef: BsModalRef;
  submitted: boolean;
  ColumnName: any = '-1';
  constructor(private FB: FormBuilder, private toastr: ToastrService, private adjustmentdetailService: InventoryAdjustmentDetailService, private invCommonService: InvCommonService, private wareHouseBinService: WareHouseBinService, private deleteRecordsService: DeleteRecordsService, public modalService: BsModalService,private adjustmentdetailStockOutService: InventoryStockAllocationDetailsService) { this.datePickerConfig = Object.assign({}, { dateInputFormat: 'YYYY-MM-DD', showWeekNumbers: false }); }

  ngOnInit() {
    this.submitted = false;
    console.log(this.SelecteWareHouseID)
    this.CreateSerialTrackingForm();
    this.BindWareHouseBins();
    this.getAdjustmentSerlisedByRecID();

  }
  CreateSerialTrackingForm() {
    debugger;
    let d = formatDate(new Date(), 'yyyy/MM/dd', 'en');
    this.InventoryAdjustmentSerialTrackingForm = this.FB.group({
      BulkNo: [null],
      Cost: [''],
      Quantity: [this.SelectedQuantity],
      SerialNo: [''],
      StartNo: [''],
      PurchaseDate: [d],
      QtyPerLine: [1]
    })
  }
  getAdjustmentSerlisedByRecID() {
    this.adjustmentdetailService.getAdjustmentSerlisedByRecID(this.SelectedAdjustmentDetail_ID).subscribe((resp: any) => {
      this.SerialList = resp.data.adjustmentSerlised;
      debugger;
      console.log(this.SerialList);
      this.submitted = false;
      if (this.SerialList.length > 0) {
        this.totalsum();
      }
      console.log(resp.data.adjustmentSerlised);
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindWareHouseBins() {
    debugger;
    this.invCommonService.getWareHouseBinByWareHouseID(this.SelecteWareHouseID).subscribe((resp: any) => {
      this.BinList = resp.data.warehousebin;
      let indexx = this.BinList.findIndex(c => c.default == true || c.default == "true");
      let BinID = null;
      if (indexx != -1 || indexx != '-1') {
        BinID = this.BinList[indexx].id;
      }
      this.InventoryAdjustmentSerialTrackingForm.patchValue({
        BulkNo: BinID,
      });

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindWareHouseBinsold() {
    /*  this.invCommonService.getWareHouseBins().subscribe((resp: any) => {
       this.BinList= resp.data.wareHouseBins;
       console.log(resp.data.wareHouseBins);
     }, (error) => {
       console.error('Problem with the sevice. Please try later : ' + error);
     }); */
    this.wareHouseBinService.getWareHouseBinByWareHouseID(this.SelecteWareHouseID).subscribe((resp: any) => {
      this.BinList = resp.data.warehousebin;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  AutoSerial() {
    if (this.SerialList && this.SerialList.length > 0) {
      this.DeleteAdjustmentSerialisedProduct();
    }
    this.SerialList = [];
    let Quantity = this.InventoryAdjustmentSerialTrackingForm.get('Quantity').value;
    let QtyPerLine = this.InventoryAdjustmentSerialTrackingForm.get('QtyPerLine').value;
    let StartNo = this.InventoryAdjustmentSerialTrackingForm.get('StartNo').value;
    let counts = Quantity / QtyPerLine;
    this.totalQuantity = 0;
    for (let i = 0; i < counts; i++) {

      let sno = this.InventoryAdjustmentSerialTrackingForm.get('SerialNo').value + StartNo;
      let object = {
        'id': '',
        'companyID': localStorage.getItem('CompanyID'),
        'adjustmentID': this.AdjustmentID,
        'AdjustmentDetail_ID': this.SelectedAdjustmentDetail_ID,
        'productID': this.ProductID,
        'productCode': this.SelectedProductCode,
        'productName': this.SelectedProductDescription,
        'binID': this.InventoryAdjustmentSerialTrackingForm.get('BulkNo').value,
        'serialNo': sno,
        'transactionDateIn': this.InventoryAdjustmentSerialTrackingForm.get('PurchaseDate').value,
        'quantity': QtyPerLine
      }
      // this.totalQuantity=this.totalQuantity+parseInt(QtyPerLine);
      this.SerialList.push(object);
      StartNo++;
    }
    this.totalsum();
  }

  DeleteAll() {
    this.SerialList = [];
    this.DeleteAdjustmentSerialisedProduct();
    this.ConfirmDialogClose();
    this.totalsum();
  }

  UpdateChanges(From) {
    debugger;
    this.submitted = true;
    this.totalsum();
    if (parseInt(this.SelectedQuantity) == this.totalQuantity) {
      this.adjustmentdetailService.updateInventoryAdjustmentSerlisedList(this.SerialList).subscribe((resp: any) => {

        /*  this.toastr.success('Adjustment Detail details Saved successfully');
         console.log(resp.data.inventoryadjustmentdetail);
         if(From=='Close'){
           this.OnCancel.emit();
         } */
        //this.RowData = resp.data.inventoryadjustmentdetail;
        debugger;
        if (resp.isSuccess == true) {
          this.toastr.success('Adjustment Detail details Saved successfully');
          console.log(resp.data.inventoryadjustmentdetail);
          if (From == 'Close') {
            this.OnCancel.emit();
          }
          this.getAdjustmentSerlisedByRecID();
        }
        else {
          this.submitted = false;
          this.toastr.warning(resp.message);
        }

      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    } else {
      this.submitted = false;
      this.toastr.warning('Total quantity should match with converted quantity (' + this.SelectedQuantity + ')');
    }
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
      'productCode': this.SelectedProductCode,
      'productName': this.SelectedProductDescription,
      'binID':BinID, //this.InventoryAdjustmentSerialTrackingForm.get('BulkNo').value,
      'serialNo': '',
      'transactionDateIn': this.InventoryAdjustmentSerialTrackingForm.get('PurchaseDate').value,
      'quantity': 0
    }
    this.SerialList.push(object);
  }

  DeleteAdjustmentSerialisedProduct() {
    this.adjustmentdetailService.deleteAdjustmentSerialisedProduct(this.SelectedAdjustmentDetail_ID, localStorage.getItem('LoginID')).subscribe((resp: any) => {
      //  this.SerialList=[];
      console.log(resp.data.adjustmentSerlised);
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onSearchChange(searchValue, i): void {
    if (!searchValue) {
      this.SerialList[i].quantity = 0;
    }
    this.totalsum();
  }
  totalsum() {
    this.totalQuantity = this.SerialList.reduce((sum, item) => sum + parseInt(item.quantity), 0);
  }
  Cancel() {
    this.OnCancel.emit();
    this.submitted = false;
  }

  DeletePopup(confirmDelete: TemplateRef<any>) {
    this.modalRef = this.modalService.show(confirmDelete);
  }

  ConfirmDialogClose() {
    this.modalRef.hide();
  }


  DeleteInventoryAdjustmentDeatilMatrix(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_INV_InventoryAdjustmentDetail_ProductStyleMatrix', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      // this.toastr.success('Deleted successfully'); 
      this.getAdjustmentSerlisedByRecID();
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  Deleteindex(i) {
    this.totalsum();
    this.SerialList.splice(i, 1);
  }
  onColumnNameSelected(event) {
    debugger;
    this.ColumnName = event;
    let obj = {
      'companyID': localStorage.getItem('CompanyID'),
      'productID': this.ProductID,
      'warehouseID': this.SelecteWareHouseID,
      'adjustmentRefID': this.SelectedAdjustmentDetail_ID,
      'columnName': this.ColumnName
    }
    this.adjustmentdetailStockOutService.SortColumns(obj).subscribe((resp: any) => {
      this.SerialList = resp.data.sortedColumns;
      console.log(resp.data.sortedColumns);
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
}

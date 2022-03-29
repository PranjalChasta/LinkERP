import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { InventoryAdjustmentDetailService } from 'src/app/inv/services/inventory-adjustment-detail.service';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { WareHouseBinService } from 'src/app/inv/services/ware-house-bin.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { formatDate } from '@angular/common';
import { InventoryService } from 'src/app/inv/services/inventory.service';

@Component({
  selector: 'app-inventoryadtustment-other',
  templateUrl: './inventoryadtustment-other.component.html',
  styleUrls: ['./inventoryadtustment-other.component.css']
})
export class InventoryadtustmentOtherComponent implements OnInit {
  @Input() CurrentStatus: string;
  @Input() AdjustmentID: any;
  @Input() ProductID: any;
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
  IsuseExpiryDates: boolean;
  constructor(private FB: FormBuilder,
     private toastr: ToastrService,
      private adjustmentdetailService: InventoryAdjustmentDetailService,
       private invCommonService: InvCommonService,
       private inventoryService: InventoryService,
        private wareHouseBinService: WareHouseBinService,
         private deleteRecordsService: DeleteRecordsService, 
         public modalService: BsModalService)
   { this.datePickerConfig = Object.assign({}, { dateInputFormat: 'YYYY-MM-DD', showWeekNumbers: false }); }

  ngOnInit() {
    this.submitted = false;
    console.log(this.SelecteWareHouseID)
     this.CheckInventory();
     this.BindWareHouseBins();
   

  }
  CheckInventory() {
    this.inventoryService.getInventoryByID(this.ProductID).subscribe((resp: any) => {
      if (resp.isSuccess) {
        this.getAdjustmentSerlisedByRecID();
        console.log(resp.data.inventorydetails.useExpiryDates); 
        if(resp.data.inventorydetails.useExpiryDates){
          this.IsuseExpiryDates=true;
        }else{
          this.IsuseExpiryDates=false;
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
      debugger;
      this.SerialList = resp.data.adjustmentSerlised;
      if (this.IsuseExpiryDates) {
        this.SerialList.forEach(element => {
          if (element.expiryDate == null || element.expiryDate == "null") {
            element.expiryDate = new Date();
          }
        });
      }
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
    
    this.invCommonService.getWareHouseBinByWareHouseID(this.SelecteWareHouseID).subscribe((resp: any) => {
      debugger;
      this.BinList = resp.data.warehousebin;  
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
        'binID': this.InventoryAdjustmentSerialTrackingForm.get('BulkNo').value,
        'serialNo': sno,
        'expiryDate':'',
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
    console.log(this.SerialList);
    this.submitted = true;
    this.totalsum();
     if (parseInt(this.SelectedQuantity) == this.totalQuantity) {
      this.adjustmentdetailService.updateInventoryAdjustmentSerlisedList(this.SerialList).subscribe((resp: any) => {
        this.getAdjustmentSerlisedByRecID();
        
        /*  this.toastr.success('Adjustment Detail details Saved successfully');
         console.log(resp.data.inventoryadjustmentdetail);
         if(From=='Close'){
           this.OnCancel.emit();
         } */
        //this.RowData = resp.data.inventoryadjustmentdetail;
        if (resp.isSuccess == true) {
          this.toastr.success('Adjustment Detail details Saved successfully');
          console.log(resp.data.inventoryadjustmentdetail);
          if (From == 'Close') {
            this.OnCancel.emit();
          }
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
    debugger;
    let ExpiryDate=null;
    if(this.IsuseExpiryDates){
      ExpiryDate=new Date();
    }else{
      ExpiryDate=null;
    }
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
      'expiryDate':ExpiryDate,
      'transactionDateIn':  new Date(Date.now()),
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

}

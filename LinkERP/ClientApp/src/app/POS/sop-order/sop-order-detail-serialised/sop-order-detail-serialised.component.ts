import { Component, OnInit, TemplateRef, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { InventoryAdjustmentDetailService } from 'src/app/inv/services/inventory-adjustment-detail.service';
import { WareHouseBinService } from 'src/app/inv/services/ware-house-bin.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { SopOrderService } from '../../services/sop-order.service';

@Component({
  selector: 'app-sop-order-detail-serialised',
  templateUrl: './sop-order-detail-serialised.component.html',
  styleUrls: ['./sop-order-detail-serialised.component.css']
})
export class SopOrderDetailSerialisedComponent implements OnInit {
  @Input() LineNum;
  @Input() SalesOrderDetailID;
  @Input() InventoryId;
  @Input() WarehouseID;
  @Output() Cancel = new EventEmitter();
  @Output()  SerializedSave = new EventEmitter<{SerializedProductForSave:any[], Total:any}>();

  CompanyID: any=localStorage.getItem('CompanyID');
  SerialisedProduct:any[]=[];
  totalQuantity: any;
  SerializedProductForSave=[];
  // InventoryAdjustmentSerialTrackingForm: FormGroup;
  // BinList: any;
  // SerialList: any;
  // totalQuantity: number;
  // modalRef: BsModalRef;
  // submitted: boolean;

  constructor(
    private FB: FormBuilder, 
    private toastr: ToastrService, 
    private adjustmentdetailService: InventoryAdjustmentDetailService, 
    private invCommonService: InvCommonService, 
    private wareHouseBinService: WareHouseBinService, 
    private deleteRecordsService: DeleteRecordsService,
    private sopOrderService: SopOrderService
  ) { }

  ngOnInit() {
    //alert(this.InventoryId);
    //alert(this.WarehouseID);
    //alert(this.SalesOrderDetailID);
    this.GetProductStyleMatrix();
  }
  GetProductStyleMatrix(){
    debugger;
    this.SerialisedProduct=[];
    this.sopOrderService.getProductStyleMatrix(this.CompanyID,this.InventoryId,this.WarehouseID).subscribe((resp: any) => {
console.log(resp)

      debugger;
      this.SerialisedProduct = resp.data.productMatrix
      
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onSearchChange(searchValue, i): void {
    debugger;
    var SaleQty = searchValue
    if (SaleQty==null|| SaleQty=="")
    {
        SaleQty =0;
        this.SerialisedProduct[i].transactionQuantity=0;
    }
    var QtyInStock =this.SerialisedProduct[i].quantityOnHand
    if (QtyInStock == null || QtyInStock == "")
    {
        QtyInStock = 0;
    }
    if(Number(SaleQty) > Number(QtyInStock))
    {
      this.toastr.warning('QtyInStock can not  be gretter then SaleQty');
       //alert("QtyInStock can not  be gretter then SaleQty");
        this.SerialisedProduct[i].transactionQuantity="0";
    }
    // if (!searchValue) {
    //   this.Resultlist[i].transactionQuantity = 0;
    // }
    // this.Resultlist[i].transactionQuantity = +searchValue;
    this.totalsum();
  }
  totalsum() {

    this.totalQuantity = this.SerialisedProduct.reduce((sum, item) => sum + parseInt(item.transactionQuantity), 0);
  }
  OnCancel() {

    this.Cancel.emit();
  }
  // CreateSerialTrackingForm() {
  //   debugger;
  //   this.InventoryAdjustmentSerialTrackingForm = this.FB.group({
  //     BulkNo: [null],
  //     Cost: [''],
  //     Quantity: [this.SelectedQuantity],
  //     SerialNo: [''],
  //     StartNo: [''],
  //     PurchaseDate: [d],
  //     QtyPerLine: [1]
  //   })
  // }
  // getAdjustmentSerlisedByRecID() {
  //   this.adjustmentdetailService.getAdjustmentSerlisedByRecID(this.SelectedAdjustmentDetail_ID).subscribe((resp: any) => {
  //     this.SerialList = resp.data.adjustmentSerlised;
  //     console.log(this.SerialList);
  //     this.submitted = false;
  //     if (this.SerialList.length > 0) {
  //       this.totalsum();
  //     }
  //     console.log(resp.data.adjustmentSerlised);
  //   }, (error) => {
  //     console.error('Problem with the sevice. Please try later : ' + error);
  //   });
  // }
  // BindWareHouseBins() { 
  //   debugger;
  //   this.invCommonService.getWareHouseBinByWareHouseID(this.SelecteWareHouseID).subscribe((resp: any) => {
  //     this.BinList = resp.data.warehousebin;  
  //   }, (error) => {
  //     console.error('Problem with the sevice. Please try later : ' + error);
  //   });
  // }
  // BindWareHouseBinsold() {
  //   /*  this.invCommonService.getWareHouseBins().subscribe((resp: any) => {
  //      this.BinList= resp.data.wareHouseBins;
  //      console.log(resp.data.wareHouseBins);
  //    }, (error) => {
  //      console.error('Problem with the sevice. Please try later : ' + error);
  //    }); */
  //   this.wareHouseBinService.getWareHouseBinByWareHouseID(this.SelecteWareHouseID).subscribe((resp: any) => {
  //     this.BinList = resp.data.warehousebin;
  //   }, (error) => {
  //     console.error('Problem with the sevice. Please try later : ' + error);
  //   });
  // }
  // AutoSerial() {
  //   if (this.SerialList && this.SerialList.length > 0) {
  //     this.DeleteAdjustmentSerialisedProduct();
  //   }
  //   this.SerialList = [];
  //   let Quantity = this.InventoryAdjustmentSerialTrackingForm.get('Quantity').value;
  //   let QtyPerLine = this.InventoryAdjustmentSerialTrackingForm.get('QtyPerLine').value;
  //   let StartNo = this.InventoryAdjustmentSerialTrackingForm.get('StartNo').value;
  //   let counts = Quantity / QtyPerLine;
  //   this.totalQuantity = 0;
  //   for (let i = 0; i < counts; i++) {

  //     let sno = this.InventoryAdjustmentSerialTrackingForm.get('SerialNo').value + StartNo;
  //     let object = {
  //       'id': '',
  //       'companyID': localStorage.getItem('CompanyID'),
  //       'adjustmentID': this.AdjustmentID,
  //       'AdjustmentDetail_ID': this.SelectedAdjustmentDetail_ID,
  //       'productID': this.ProductID,
  //       'binID': this.InventoryAdjustmentSerialTrackingForm.get('BulkNo').value,
  //       'serialNo': sno,
  //       'transactionDateIn': this.InventoryAdjustmentSerialTrackingForm.get('PurchaseDate').value,
  //       'quantity': QtyPerLine
  //     }
  //     // this.totalQuantity=this.totalQuantity+parseInt(QtyPerLine);
  //     this.SerialList.push(object);
  //     StartNo++;
  //   }
  //   this.totalsum();
  // }

  // DeleteAll() {
  //   this.SerialList = [];
  //   this.DeleteAdjustmentSerialisedProduct();
  //   this.ConfirmDialogClose();
  //   this.totalsum();
  // }
  
    
  UpdateChanges() {
   // this.SerializedProductForSave=[];
   /// var ok=[];
    this.SerialisedProduct.forEach(SLP => {
      if (SLP.transactionQuantity>0)
      {
       //var  test=this.SerializedProductForSave.find(o=>o.id!=SLP.id);
       this.SerializedProductForSave.push(SLP);
      }       
});
this.SerializedSave.emit({SerializedProductForSave: this.SerializedProductForSave, Total:this.totalQuantity});
this.Cancel.emit();
  }
  // UpdateChanges(From) {
  //   this.submitted = true;
  //   this.totalsum();
  //   //if (parseInt(this.SelectedQuantity) == this.totalQuantity) {
  //     this.adjustmentdetailService.updateInventoryAdjustmentSerlisedList(this.SerialList).subscribe((resp: any) => {

  //       /*  this.toastr.success('Adjustment Detail details Saved successfully');
  //        console.log(resp.data.inventoryadjustmentdetail);
  //        if(From=='Close'){
  //          this.OnCancel.emit();
  //        } */
  //       //this.RowData = resp.data.inventoryadjustmentdetail;

  //       if (resp.isSuccess == true) {
  //         this.toastr.success('Adjustment Detail details Saved successfully');
  //         console.log(resp.data.inventoryadjustmentdetail);
  //         if (From == 'Close') {
  //           this.OnCancel.emit();
  //         }
  //         this.getAdjustmentSerlisedByRecID();
  //       }
  //       else {
  //         this.submitted = false;
  //         this.toastr.warning(resp.message);
  //       }

  //     }, (error) => {
  //       console.error('Problem with the sevice. Please try later : ' + error);
  //     });
  //   /* } else {
  //     this.submitted = false;
  //     this.toastr.warning('Total quantity should match with converted quantity (' + this.SelectedQuantity + ')');
  //   } */
  // }
  // addnew() {

  //   let object = {
  //     'id': '',
  //     'companyID': localStorage.getItem('CompanyID'),
  //     'adjustmentID': this.AdjustmentID,
  //     'AdjustmentDetail_ID': this.SelectedAdjustmentDetail_ID,
  //     'productID': this.ProductID,
  //     'binID': this.InventoryAdjustmentSerialTrackingForm.get('BulkNo').value,
  //     'serialNo': '',
  //     'transactionDateIn': this.InventoryAdjustmentSerialTrackingForm.get('PurchaseDate').value,
  //     'quantity': 0
  //   }
  //   this.SerialList.push(object);
  // }

  // DeleteAdjustmentSerialisedProduct() {
  //   this.adjustmentdetailService.deleteAdjustmentSerialisedProduct(this.SelectedAdjustmentDetail_ID, localStorage.getItem('LoginID')).subscribe((resp: any) => {
  //     //  this.SerialList=[];
  //     console.log(resp.data.adjustmentSerlised);
  //   }, (error) => {
  //     console.error('Problem with the sevice. Please try later : ' + error);
  //   });
  // }
  // onSearchChange(searchValue, i): void {
  //   if (!searchValue) {
  //     this.SerialList[i].quantity = 0;
  //   }
  //   this.totalsum();
  // }
  // totalsum() {
  //   this.totalQuantity = this.SerialList.reduce((sum, item) => sum + parseInt(item.quantity), 0);
  // }
  // Cancel() {
  //   this.OnCancel.emit();
  //   this.submitted = false;
  // }
  // DeletePopup(confirmDelete: TemplateRef<any>) {
  //   this.modalRef = this.modalService.show(confirmDelete);
  // }
  // ConfirmDialogClose() {
  //   this.modalRef.hide();
  // }
  // DeleteInventoryAdjustmentDeatilMatrix(ID) {
  //   this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_INV_InventoryAdjustmentDetail_ProductStyleMatrix', localStorage.getItem('LoginID')).subscribe((resp: any) => {
  //     // this.toastr.success('Deleted successfully'); 
  //     this.getAdjustmentSerlisedByRecID();
  //   }, (error) => {
  //     console.error('Problem with the sevice. Please try later : ' + error);
  //   });
  // }
  // Deleteindex(i) {
  //   this.totalsum();
  //   this.SerialList.splice(i, 1);
  // }
}
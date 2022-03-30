import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { GoodsReceivedNotesService } from '../../services/goods-received-notes.service';

@Component({
  selector: 'app-grn-product-serial',
  templateUrl: './grn-product-serial.component.html',
  styleUrls: ['./grn-product-serial.component.css']
})
export class GrnProductSerialComponent implements OnInit {
  @Input() ProductID: any;
  @Input() SelectedPurchaseDetail_ID: any;  
  @Input() SelectedQuantity: any; 
  @Input() SelectedProductCode: any;
  @Input() SelectedProductDescription: any;
  @Input()  IsClose: boolean;
 @Output()   OnCancel = new EventEmitter(); 
 @Input()  PurchaseStatus: string;
 @Input()  SelecteWareHouseID: any;
 @Input() SelectedQuantityOrderedToCheck;
 BinList: any;
 totalQuantity: number;
 ProductStyleMatrixRow: any;
 ProductStyleMatrixColumn: any;
 RowData: any;
 Resultlist: any;
 SelectedRowID: any;
 filterargs: any;
 selectedRow: boolean[] = [];
 submitted: boolean;
 IsuseExpiryDates: boolean;
 ColumnName;
 RowName; 
 constructor 
   (private toastr: ToastrService,
     public goodsReceivedNotesService: GoodsReceivedNotesService,
     private invCommonService: InvCommonService,
     private deleteRecordsService: DeleteRecordsService 
   ) { }

 ngOnInit() {
   this.submitted = false;
     this.BindWareHouseBins();
    this.getTransferProductMatrixByRecID(); 
    console.log(this.IsClose)
 }
 BindWareHouseBins() { 
  this.invCommonService.getWareHouseBinByWareHouseID(this.SelecteWareHouseID).subscribe((resp: any) => {
    this.BinList = resp.data.warehousebin;
  }, (error) => {
    console.error('Problem with the sevice. Please try later : ' + error);
  });
}
getTransferProductMatrixByRecID() {
  this.goodsReceivedNotesService.getProductMatrixByRecID(this.ProductID,this.SelectedPurchaseDetail_ID).subscribe((resp: any) => { 
    this.RowData = resp.data.purchasematrix.lBS_PUR_PurchaseGRNDetailsProductStyleMatrix;  
    console.log(this.RowData);
    this.RowData.forEach(obj => {
      obj.binID = obj.binID ==   null ? "00000000-0000-0000-0000-000000000000": obj.binID;
    })
    this.totalsum();
  }, (error) => {
    console.error('Problem with the sevice. Please try later : ' + error);
  });
}
addnew() {
  let object = {
    'companyID': localStorage.getItem('CompanyID'),
    'binID': '00000000-0000-0000-0000-000000000000', 
    'createdBY': localStorage.getItem('LoginID'),
    'dateCreated': "0001-01-01T00:00:00",
    'purchaseGRNDetailsID':this.SelectedPurchaseDetail_ID,
    'deleteDate': null,
    'deleteStatus': null,
    'deleted': false,
    'deletedBy': null,
    'expiryDate': new Date(Date.now()),
    'id': null,
    'productID': this.ProductID,
    'productMatrixColumn': null,
    'productMatrixRow': null, 
    'purchaseQuantity':1,
    'serialNo': null,
    'styleMatrixDetailName': null,
     
  }
  this.RowData.push(object);
}
UpdateChanges(From) {
  if(Number(this.totalQuantity)>Number(this.SelectedQuantityOrderedToCheck))
  {
    this.toastr.warning("Receiving quantity can not be more than the ordered quantity.");
    return;
  }
  this.RowData.forEach(obj => {
    obj.binID = obj.binID == "00000000-0000-0000-0000-000000000000" ? null : obj.binID;
  })
  this.submitted = true; 
    this.goodsReceivedNotesService.UpdateGRNDetailsProductStyleMatrixList(this.RowData).subscribe((resp: any) => {
      if (resp.isSuccess) { 
        this.submitted = false;
        this.toastr.success('Purchase order details Saved successfully');
        if (From == 'Close') {
          this.OnCancel.emit();
        }
        this.getTransferProductMatrixByRecID(); 
      }
      else {
        this.toastr.warning(resp.message);
      }
      this.submitted = false;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
      this.submitted = false;
    }); 
}
DeleteInventorystocktakeDeatilMatrix(ID) {
  this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_PUR_PurchaseGRNDetailsProductStyleMatrix', localStorage.getItem('LoginID')).subscribe((resp: any) => {
    this.getTransferProductMatrixByRecID(); 
  }, (error) => {
    console.error('Problem with the sevice. Please try later : ' + error);
  });
}
Deleteindex(i) {
  this.RowData.splice(i, 1);
}
Closenote(){
  this.getTransferProductMatrixByRecID(); 
  this.OnCancel.emit();
}

totalsum() {
  this.totalQuantity = this.RowData.reduce((sum, item) => sum + parseInt(item.purchaseQuantity), 0);
}
onSearchChange(searchValue, i): void {
  // this.Resultlist[i].purchaseQuantity = 1;
   if (!searchValue) {
     this.RowData[i].purchaseQuantity = 0;
   }
    this.totalsum();
 }
}

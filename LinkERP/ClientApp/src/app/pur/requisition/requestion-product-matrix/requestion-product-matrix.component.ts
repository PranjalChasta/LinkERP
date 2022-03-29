import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InvProductStyleMatrixTransfer, ProductStyleTransferMatrixColumn, TransferMatrixDetail } from 'src/app/models/inv/inv-ProductStyleMatrixTransfer';
import { ToastrService } from 'ngx-toastr';
import { InventoryTransferDetailService } from 'src/app/inv/services/inventory-transfer-detail.service';
import { WareHouseBinService } from 'src/app/inv/services/ware-house-bin.service';
import { InventoryTransferStatusService } from 'src/app/inv/inventory-transfer/inventory-transfer-status.service';
import { LBS_INV_InventoryTransferStatus } from 'src/app/models/inv/lbs_inv-inventory-transfer-status';
import { RequisitionDetailsService } from '../../services/requisition-details.service';

@Component({
  selector: 'app-requestion-product-matrix',
  templateUrl: './requestion-product-matrix.component.html',
  styleUrls: ['./requestion-product-matrix.component.css']
})
export class RequestionProductMatrixComponent implements OnInit {

  @Input() RequisitionID: any;
  @Input() ProductID: any;
  @Input() SelectedRequisitionDetail_ID: any; 
  @Input() WareHouseToID: any;
  @Input() SelectedQuantity: any; 
  @Output() OnCancel = new EventEmitter();
  @Input() RequisitionStatus: string;
  InvProductStyleTransferMatrixobj: any = new InvProductStyleMatrixTransfer();
  productStyleTransferMatrixColumn: any = new ProductStyleTransferMatrixColumn();
  TransferMatrixDetaillist: any = new TransferMatrixDetail();
  BinList: any;
  totalQuantity: number;
  ProductStyleMatrixRow: any;
  ProductStyleMatrixColumn: any;
  RequisitionDetailsProductStyleMatrix: any;
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
      private requistiondetails: RequisitionDetailsService,
      private wareHouseBinService: WareHouseBinService,
      private invStatusService: InventoryTransferStatusService
    ) { }

  ngOnInit() {
    //this.ProductMatrixList = [];
    console.log(this.RequisitionStatus)
    this.submitted = false;
    this.BindWareHouseBins();
    this.getTransferProductMatrixByRecID();
    this.SelectedRowID = '';
    this.filterargs = { 'productMatrixRow': '' };
  }
  
  BindWareHouseBins() {
    this.wareHouseBinService.getWareHouseBinByWareHouseID(this.WareHouseToID).subscribe((resp: any) => {
      this.BinList = resp.data.warehousebin;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  /* getTransferProductMatrixByRecID() {

    this.requistiondetails.getProductMatrixByRecID(this.ProductID, this.RequisitionID, this.SelectedRequisitionDetail_ID).subscribe((resp: any) => {
      this.Resultlist = [];
      this.ProductStyleMatrixRow = resp.data.transferSerlised.productStyleMatrixRow;
      this.ProductStyleMatrixColumn = resp.data.transferSerlised.productStyleMatrixColumn;
      if(this.ProductStyleMatrixRow.length>0){
        this.RowName=this.ProductStyleMatrixRow[0].styleMatrixDetailCode
      }
      if(this.ProductStyleMatrixColumn.length>0){
        this.ColumnName=this.ProductStyleMatrixColumn[0].styleMatrixDetailCode
      }
     if(this.invStatusService.status=='New') {
      this.TransferDetailProductStyleMatrix = resp.data.transferSerlised.inventoryTransferDetail_ProductStyleMatrix;
     }
     else{
      this.TransferDetailProductStyleMatrix = resp.data.transferSerlised.inventoryTransferDetail_ProductStyleMatrixshipped;
     }
      
      if (this.ProductStyleMatrixRow.length > 0) {
        for (let i = 0; i < this.ProductStyleMatrixRow.length; i++) {
           this.myFunc(this.ProductStyleMatrixRow[i].id,i)
        }
        this.myFunc(this.ProductStyleMatrixRow[0].id,0)
      }
      console.log(this.TransferDetailProductStyleMatrix);
      debugger;
      let temData = this.TransferDetailProductStyleMatrix.filter(x => (x.requestedQty || x.shippedQty || x.receivedQty) != 0)
      console.log(temData);

      for (var i = 0; i < temData.length; i++) {
        let color = this.ProductStyleMatrixRow.find(x => x.id == temData[i].productMatrixRow);
        let size = this.ProductStyleMatrixColumn.find(x => x.id == temData[i].productMatrixColumn);
        let data = {
          'companyID': temData[i].companyID,
          'transferID': temData[i].transferID,
          'transferDetailID': temData[i].transferDetailID,
          'productID': temData[i].productID,
          'binID':null,
          'productMatrixRow': temData[i].productMatrixRow,
          'productMatrixColumn': temData[i].productMatrixColumn,
          'serialNo': temData[i].serialNo,
          'sourceReference': temData[i].sourceReference,
          'transactionDateIn': temData[i].transactionDateIn,
          'styleMatrixDetailName': temData[i].styleMatrixDetailName,
          'expiryDate': temData[i].expiryDate,
          // 'requestedQty': RequestedQty,
          // 'shippedQty': ShippedQty,
          // 'receivedQty': ReceivedQty,
          // 'styleMatrixName': "Size",
          'previouslyReceviedQty': temData[i].previouslyReceviedQty,
          'id': temData[i].id,
          'createdBY': temData[i].createdBY,
          'dateCreated': temData[i].dateCreated,
          'deleted': temData[i].deleted,
          'deletedBy': temData[i].deletedBy,
          'deleteDate': temData[i].deleteDate,
          'deleteStatus': temData[i].deleteStatus,
          'Color': color.styleMatrixDetailName,
          'Size': size.styleMatrixDetailName,
          'requestedQty': temData[i].requestedQty,
          'shippedQty': temData[i].shippedQty,
          'receivedQty': temData[i].receivedQty,
        }
        this.MatrixGrid.push(data);
      }
      this.totalsumForMatrix();
      this.IsSubmit=false;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  } */


  getTransferProductMatrixByRecID() {
    this.requistiondetails.getProductMatrixByRecID(this.ProductID, this.RequisitionID, this.SelectedRequisitionDetail_ID).subscribe((resp: any) => {
      debugger;
      this.Resultlist = [];
      this.ProductStyleMatrixRow = resp.data.transferSerlised.productStyleMatrixRow;
      this.ProductStyleMatrixColumn = resp.data.transferSerlised.productStyleMatrixColumn;
      this.RequisitionDetailsProductStyleMatrix = resp.data.transferSerlised.lbS_PUR_RequisitionDetailsProductStyleMatrix;
      if(this.ProductStyleMatrixRow.length>0){
        this.RowName=this.ProductStyleMatrixRow[0].styleMatrixDetailCode
      }
      if(this.ProductStyleMatrixColumn.length>0){
        this.ColumnName=this.ProductStyleMatrixColumn[0].styleMatrixDetailCode
      }
      console.log(resp.data.adjustmentSerlised);
      if (this.ProductStyleMatrixRow.length > 0) {
        for (let i = 0; i < this.ProductStyleMatrixRow.length; i++) {
           this.myFunc(this.ProductStyleMatrixRow[i].id,i)
        }
        this.myFunc(this.ProductStyleMatrixRow[0].id,0)
        this.totalsum();
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }


  UpdateChanges(From) {
    console.log(this.Resultlist)
    debugger;
    this.submitted = true; 
      this.requistiondetails.updateInventoryAdjustmentProductStyleMatrixList(this.Resultlist).subscribe((resp: any) => {
        this.submitted = false;
        this.toastr.success('Adjustment Detail details Saved successfully');
        if (From == 'Close') {
          this.OnCancel.emit();
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
        this.submitted = false;
      });
     

  }

  myFunc(id, index) {
    this.selectedRow = [];
    this.selectedRow[index] = true;
    this.SelectedRowID = id;
    let Checkindex = this.Resultlist.findIndex(c => c.productMatrixRow == id);
    if (Checkindex < 0) {
      for (let i = 0; i < this.ProductStyleMatrixColumn.length; i++) {
        let TempResultlist = this.RequisitionDetailsProductStyleMatrix.filter(item => item['productMatrixRow'] === id && item['productMatrixColumn'] === this.ProductStyleMatrixColumn[i].id && item['requisitionDetailID'] === this.SelectedRequisitionDetail_ID);
        let Binid = null;
        let Quantity = 0;
        let Pid =null;
        let ExpDate = "";
        if (TempResultlist.length > 0) {
          Binid = TempResultlist[0].binID;
          Quantity = TempResultlist[0].purchaseQuantity;
          Pid = TempResultlist[0].id;
          ExpDate=TempResultlist[0].expiryDate;
        }
        let object = {
          'companyID': localStorage.getItem('CompanyID'),
          'requisitionID': this.RequisitionID,
          'requisitionDetailID': this.SelectedRequisitionDetail_ID,
          'productID': this.ProductID, 
          'productMatrixRow': id,
          'productMatrixColumn': this.ProductStyleMatrixColumn[i].id,
          'serialNo': null, 
          'styleMatrixDetailName': this.ProductStyleMatrixColumn[i].styleMatrixDetailName,
          'expiryDate': "",
          'purchaseQuantity': Quantity, 
          'id': Pid,
          'createdBY':localStorage.getItem('LoginID'),
         // 'dateCreated': "0001-01-01T00:00:00",
          'deleted': false,
          'deletedBy': "",
      //    'deleteDate': "0001-01-01T00:00:00",
          'deleteStatus': null
        }
        this.Resultlist.push(object);
      }
     // this.totalsum();
    }
  }
  onSearchChange(searchValue, i): void {
   // this.Resultlist[i].purchaseQuantity = 1;
    if (!searchValue) {
      this.Resultlist[i].purchaseQuantity = 0;
    }
     this.totalsum(); 
  }
  totalsum() {
    this.totalQuantity = this.Resultlist.reduce((sum, item) => sum + parseInt(item.purchaseQuantity), 0);
  }
  Cancel() {
    this.OnCancel.emit();
    this.submitted = false;
  }
}

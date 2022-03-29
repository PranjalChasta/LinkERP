import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { WareHouseBinService } from 'src/app/inv/services/ware-house-bin.service';
import { GoodsReceivedNotesService } from '../../services/goods-received-notes.service';
import { PurchaseOrderDetailService } from '../../services/purchase-order-detail.service';

@Component({
  selector: 'app-goods-recive-productstyle',
  templateUrl: './goods-recive-productstyle.component.html',
  styleUrls: ['./goods-recive-productstyle.component.css']
})
export class GoodsReciveProductstyleComponent implements OnInit {
  RowData: any;
  @Input() ProductID: any;
  @Input() SelectedPurchaseDetail_ID: any;
  @Input() SelectedQuantity: any;
  @Input() SelectedProductCode: any;
  @Input() SelectedProductDescription: any;
  @Output() OnCancel = new EventEmitter();
  @Input() PurchaseStatus: string;
  @Input() SelecteWareHouseID: any;
  @Input() IsClose: boolean;
  @Input() SelectedQuantityOrderedToCheck;
  BinList: any;
  totalQuantity: number;
  ProductStyleMatrixRow: any;
  ProductStyleMatrixColumn: any;
  GRNDetailsProductStyleMatrix: any;
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
  ) { }

  ngOnInit() {
    this.submitted = false;
    this.BindWareHouseBins();
    this.getTransferProductMatrixByRecID();
    this.SelectedRowID = '';
    this.filterargs = { 'productMatrixRow': '' };
  }
  BindWareHouseBins() {
    this.invCommonService.getWareHouseBinByWareHouseID(this.SelecteWareHouseID).subscribe((resp: any) => {
      this.BinList = resp.data.warehousebin;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  getTransferProductMatrixByRecID() {
    this.goodsReceivedNotesService.getProductMatrixByRecID(this.ProductID, this.SelectedPurchaseDetail_ID).subscribe((resp: any) => {
      debugger;
      this.Resultlist = [];
      this.ProductStyleMatrixRow = resp.data.purchasematrix.productStyleMatrixRow;
      this.ProductStyleMatrixColumn = resp.data.purchasematrix.productStyleMatrixColumn;
      this.GRNDetailsProductStyleMatrix = resp.data.purchasematrix.lBS_PUR_PurchaseGRNDetailsProductStyleMatrix;
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
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }


  UpdateChanges(From) {
    if (Number(this.totalQuantity) > Number(this.SelectedQuantityOrderedToCheck)) {
      this.toastr.warning("Receiving quantity can not be more than the ordered quantity.");
      return;
    }
    this.submitted = true;
    this.Resultlist.forEach(obj => {
      obj.binID = obj.binID == "00000000-0000-0000-0000-000000000000" ? null : obj.binID;
    })
    this.goodsReceivedNotesService.UpdateGRNDetailsProductStyleMatrixList(this.Resultlist).subscribe((resp: any) => {
      if (resp.isSuccess) {
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

  myFunc(id, index) {
    this.selectedRow = [];
    this.selectedRow[index] = true;
    this.SelectedRowID = id;
    let Checkindex = this.Resultlist.findIndex(c => c.productMatrixRow == id);
    if (Checkindex < 0) {
      for (let i = 0; i < this.ProductStyleMatrixColumn.length; i++) {
        let TempResultlist = this.GRNDetailsProductStyleMatrix.filter(item => item['productMatrixRow'] === id && item['productMatrixColumn'] === this.ProductStyleMatrixColumn[i].id && item['purchaseGRNDetailsID'] === this.SelectedPurchaseDetail_ID);
        let Binid = '00000000-0000-0000-0000-000000000000';
        let Quantity = 0;
        let Pid = null;
        let ExpDate = "";
        debugger;
        if (TempResultlist.length > 0) {
          Binid = TempResultlist[0].binID == null ? '00000000-0000-0000-0000-000000000000' : TempResultlist[0].binID;
          Quantity = TempResultlist[0].purchaseQuantity;
          Pid = TempResultlist[0].id;
          ExpDate = TempResultlist[0].expiryDate;
        }
        let object = {
          'companyID': localStorage.getItem('CompanyID'),
          'purchaseGRNDetailsID': this.SelectedPurchaseDetail_ID,
          'productID': this.ProductID,
          'productMatrixRow': id,
          'productMatrixColumn': this.ProductStyleMatrixColumn[i].id,
          'serialNo': null,
          'styleMatrixDetailName': this.ProductStyleMatrixColumn[i].styleMatrixDetailName,
          'expiryDate': "",
          'purchaseQuantity': Quantity,
          'id': Pid,
          'binID': Binid,
          'createdBY': localStorage.getItem('LoginID'),
          // 'dateCreated': "0001-01-01T00:00:00",
          'deleted': false,
          'deletedBy': "",
          //'deleteDate': "0001-01-01T00:00:00",
          'deleteStatus': null
        }
        this.Resultlist.push(object);
      }
      this.totalsum();
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
    this.getTransferProductMatrixByRecID();
    this.OnCancel.emit();
    this.submitted = false;
  }
  Closenote() {
    this.getTransferProductMatrixByRecID();
    this.OnCancel.emit();
  }
}

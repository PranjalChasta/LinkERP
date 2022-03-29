import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { WareHouseBinService } from '../../services/ware-house-bin.service';
import { InventoryTransferDetailService } from '../../services/inventory-transfer-detail.service';
import { InvProductStyleMatrixTransfer, ProductStyleTransferMatrixColumn, TransferMatrixDetail } from 'src/app/models/inv/inv-ProductStyleMatrixTransfer';
import { InventoryTransferStatusService } from '../inventory-transfer-status.service';
import { LBS_INV_InventoryTransferStatus } from 'src/app/models/inv/lbs_inv-inventory-transfer-status';

@Component({
  selector: 'app-matrix-product-transfer',
  templateUrl: './matrix-product-transfer.component.html',
  styleUrls: ['./matrix-product-transfer.component.css']
})
export class MatrixProductTransferComponent implements OnInit {
  @Input() TransferID: any;
  @Input() ProductID: any;
  @Input() SelectedTransferDetail_ID: any;
  @Input() WareHouseFromID: any;
  @Input() WareHouseToID: any;
  @Input() SelectedQuantity: any;
  @Input() CurrentStatus: any;
  @Output() OnCancel = new EventEmitter();
  InvProductStyleTransferMatrixobj: any = new InvProductStyleMatrixTransfer();
  productStyleTransferMatrixColumn: any = new ProductStyleTransferMatrixColumn();
  TransferMatrixDetaillist: any = new TransferMatrixDetail();
  BinList: any;
  totalQuantity: number;
  ProductMatrixList: any;
  ProductStyleMatrixRow: any;
  ProductStyleMatrixColumn: any;
  Resultlist: any;
  selectedRow: boolean[] = [];
  SelectedRowID: any;
  filterargs: any;
  inventoryTransferDetail_ProductStyleMatrix: any;
  TransferDetailProductStyleMatrix: any;
  MatrixGrid: any = [];
  IsSubmit:boolean;
  ColumnName;
  RowName;
  constructor
    (private toastr: ToastrService,
      private transferdetailService: InventoryTransferDetailService,
      private wareHouseBinService: WareHouseBinService,
      private invStatusService: InventoryTransferStatusService
    ) { }

  ngOnInit() {
    this.ProductMatrixList = [];
    this.BindWareHouseBins();
    this.getTransferProductMatrixByRecID();
    this.SelectedRowID = '';
    this.filterargs = { 'productMatrixRow': '' };
  }
  
  BindWareHouseBins() {
    this.wareHouseBinService.getWareHouseBinByWareHouseID(this.WareHouseFromID).subscribe((resp: any) => {
      this.BinList = resp.data.warehousebin;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  getTransferProductMatrixByRecID() {

    this.transferdetailService.getTransferProductMatrixByRecID(this.ProductID, this.TransferID, this.SelectedTransferDetail_ID).subscribe((resp: any) => {
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
  }


  UpdateChanges(from) {
    this.IsSubmit = true;
    this.totalsum();
    if (parseInt(this.SelectedQuantity) == this.totalQuantity) {

 /*    if (parseInt(this.SelectedQuantity) == this.totalQuantity) { */
      this.transferdetailService.updateInventoryTransferSerlisedList(this.Resultlist).subscribe((resp: any) => {
        this.toastr.success('Transfer Detail details Saved successfully');
        console.log(resp.data.inventoryadjustmentdetail);
        if(from=='Close'){
          this.OnCancel.emit();
        }
        this.getTransferProductMatrixByRecID();
        //this.RowData = resp.data.inventoryadjustmentdetail;

      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });

    /* } else {
      this.toastr.warning('Total quantity should match with converted quantity (' + this.SelectedQuantity + ')');
    } */
    } else {
      this.IsSubmit = false;
      this.toastr.warning('Total quantity should match with requested quantity (' + this.SelectedQuantity + ')');
    }
  }

  myFunc(id, index) {
    this.selectedRow = [];
    this.selectedRow[index] = true;
    this.SelectedRowID = id;
    this.filterargs = { 'productMatrixRow': id };
    let Checkindex = this.Resultlist.findIndex(c => c.productMatrixRow == id);
    if (Checkindex < 0) {
      for (let i = 0; i < this.ProductStyleMatrixColumn.length; i++) {
        let TempResultlist = this.TransferDetailProductStyleMatrix.filter(item => item['productMatrixRow'] === id && item['productMatrixColumn'] === this.ProductStyleMatrixColumn[i].id && item['transferDetailID'] === this.SelectedTransferDetail_ID);
        let Binid = null;
        let RequestedQty = 0;
        let ShippedQty = 0;
        let ReceivedQty = 0;
        let Pid = "";
        if (TempResultlist.length > 0) {
          Binid = TempResultlist[0].binID;
          RequestedQty = TempResultlist[0].requestedQty;
          ShippedQty = TempResultlist[0].shippedQty;
          ReceivedQty = TempResultlist[0].receivedQty;
          Pid = TempResultlist[0].id;
        }

        let object = {
          'companyID': localStorage.getItem('CompanyID'),
          'transferID': this.TransferID,
          'transferDetailID': this.SelectedTransferDetail_ID,
          'productID': this.ProductID,
          'binID': Binid,
          'productMatrixRow': id,
          'productMatrixColumn': this.ProductStyleMatrixColumn[i].id,
          'serialNo': null,
          'sourceReference': null,
          'transactionDateIn': null,
          'styleMatrixDetailName': this.ProductStyleMatrixColumn[i].styleMatrixDetailName,
          'expiryDate': null,
          'requestedQty': RequestedQty,
          'shippedQty': ShippedQty,
          'receivedQty': ReceivedQty,
          // 'styleMatrixName': "Size",
          'id': Pid,
          'createdBY': null,
          'dateCreated': "0001-01-01T00:00:00",
          'deleted': false,
          'deletedBy': null,
          'deleteDate': "0001-01-01T00:00:00",
          'deleteStatus': null

        }
        this.Resultlist.push(object);
      }
      this.totalsum();
    }
  }

  onSearchChange(searchValue, id, i): void {
    if (!searchValue) {
      let index = this.Resultlist.findIndex(item => item['productMatrixRow'] === id && item['productMatrixColumn'] === this.ProductStyleMatrixColumn[i].id && item['transferDetailID'] === this.SelectedTransferDetail_ID);
      if (this.invStatusService.status == LBS_INV_InventoryTransferStatus.New) {
        this.Resultlist[index].requestedQty = 0;
      } else if (this.invStatusService.status == LBS_INV_InventoryTransferStatus.Requested) {
        this.Resultlist[index].shippedQty = 0;
      } else if (this.invStatusService.status == LBS_INV_InventoryTransferStatus.Shipped) {
        this.Resultlist[index].receivedQty = 0;
      }
    }
    this.totalsum();
  }
  totalsum() {
    if (this.invStatusService.status == LBS_INV_InventoryTransferStatus.New) {
      this.totalQuantity = this.Resultlist.reduce((sum, item) => sum + parseInt(item.requestedQty), 0);
    } else if (this.invStatusService.status == LBS_INV_InventoryTransferStatus.Requested) {
      this.totalQuantity = this.Resultlist.reduce((sum, item) => sum + parseInt(item.shippedQty), 0);
    } else if (this.invStatusService.status == LBS_INV_InventoryTransferStatus.Shipped) {
      this.totalQuantity = this.Resultlist.reduce((sum, item) => sum + parseInt(item.receivedQty), 0);
    }

  }
  Cancel() {
    this.IsSubmit=false;
    this.OnCancel.emit();
  }

  onMatrixSearchChange(searchValue, i) {
    if (!searchValue) {
      if (this.invStatusService.status == LBS_INV_InventoryTransferStatus.Requested) {
        this.MatrixGrid[i].shippedQty = 0;
      } else if (this.invStatusService.status == LBS_INV_InventoryTransferStatus.Shipped) {
        this.MatrixGrid[i].receivedQty = 0;
      }
    }
    this.totalsumForMatrix();
  }
  totalsumForMatrix() {
    if (this.invStatusService.status == LBS_INV_InventoryTransferStatus.Requested) {
      this.totalQuantity = this.MatrixGrid.reduce((sum, item) => sum + parseInt(item.shippedQty), 0);
    } else if (this.invStatusService.status == LBS_INV_InventoryTransferStatus.Shipped) {
      this.totalQuantity = this.MatrixGrid.reduce((sum, item) => sum + parseInt(item.receivedQty), 0);
    }
  }

  matrixGridSave(from) {
    this.transferdetailService.updateInventoryTransferSerlisedList(this.MatrixGrid).subscribe((resp: any) => {
      this.toastr.success('Transfer detail for product style matrix has been saved successfully');
      if(from=='Close'){
        this.OnCancel.emit();
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onMatrixCheckReceive(searchValue, i) {
    if (!searchValue) {
      if (this.invStatusService.status == LBS_INV_InventoryTransferStatus.Requested) {
        this.MatrixGrid[i].shippedQty = 0;
      } else if (this.invStatusService.status == LBS_INV_InventoryTransferStatus.Shipped) {
        this.MatrixGrid[i].receivedQty = 0;
      }
    }
    if(parseInt(this.MatrixGrid[i].shippedQty)<(parseInt(this.MatrixGrid[i].receivedQty)+parseInt(this.MatrixGrid[i].previouslyReceviedQty)))
    {
      this.toastr.warning('Received Quantity is greater than Shipped Quantity');
    }
  }
}

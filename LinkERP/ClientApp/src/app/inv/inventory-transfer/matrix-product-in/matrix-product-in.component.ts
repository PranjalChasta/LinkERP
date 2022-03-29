import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InvProductStyleMatrixTransfer, ProductStyleTransferMatrixColumn, TransferMatrixDetail } from 'src/app/models/inv/inv-ProductStyleMatrixTransfer';
import { ToastrService } from 'ngx-toastr';
import { WareHouseBinService } from '../../services/ware-house-bin.service';
import { InventoryTransferDetailService } from '../../services/inventory-transfer-detail.service';
import { InventoryStockAllocationDetailsService } from '../../services/inventory-stock-allocation-details.service';
import { InventoryTransferStatusService } from '../inventory-transfer-status.service';

@Component({
  selector: 'app-matrix-product-in',
  templateUrl: './matrix-product-in.component.html',
  styleUrls: ['./matrix-product-in.component.css']
})
export class MatrixProductInComponent implements OnInit {
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
  IsSubmit: boolean;
  colName: any = '-1';
  constructor(private toastr: ToastrService,
    private wareHouseBinService: WareHouseBinService,
    private transferdetailService: InventoryTransferDetailService,
    private transferdetailStockOutService: InventoryStockAllocationDetailsService, private invStatusService: InventoryTransferStatusService) { }

  ngOnInit() {
    this.BindWareHouseBins();
  }
  BindWareHouseBins() {
    this.wareHouseBinService.getWareHouseBinByWareHouseID(this.WareHouseToID).subscribe((resp: any) => {
      this.BinList = resp.data.warehousebin;
      this.getTransferSerlisedOutByRecID();

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

    this.transferdetailStockOutService.gtInventoryForMatrixTransferReceive(localStorage.getItem('CompanyID'), this.ProductID, this.WareHouseToID, this.SelectedTransferDetail_ID).subscribe((resp: any) => {
      this.IsSubmit = false;
      debugger;
      this.MatrixGrid = resp.data.inventorystockallocationdetailsforout;

      this.MatrixGrid.forEach(obj => {
        if (this.BinList) {
          let binID = obj.binID
          let index = this.BinList.filter(r => r.id == binID)
          let Defaultbin = this.BinList.filter(r => r.default == true)[0];
          if (Defaultbin != null) {
            obj.binID = obj.binID == null ? Defaultbin.id : (index.length > 0 ? obj.binID : Defaultbin.id);
          }
          else {
            obj.binID = null;
          }
        }
      });

      console.log(this.MatrixGrid)
      this.totalsum();

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  Cancel() {
    this.IsSubmit = false;
    this.OnCancel.emit();
  }

  /* totalsum() {
    this.totalTransferQty = this.SerialListOut.reduce((sum, item) => sum + parseInt(item.shippedQty), 0);
  } */

  /*  onSearchChange(searchValue, i) {
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
   } */
  SaveOutStock(from) {
    this.IsSubmit = true;
    this.transferdetailService.updateInventoryTransferSerlisedListOut(this.MatrixGrid).subscribe((resp: any) => {
      this.toastr.success('Transfer Detail for out stock Saved successfully');
      if (from == 'Close') {
        this.OnCancel.emit();
      }
      this.getTransferSerlisedOutByRecID();
      //this.Cancel();
      //this.RowData = resp.data.inventoryadjustmentdetail;

    }, (error) => {
      this.IsSubmit = false;
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  onSearchreceiveChange(searchValue,id,indexx){
    console.log(searchValue,id);
        if (!searchValue) {
          let index = this.MatrixGrid.findIndex(c => c.id == id);
          this.MatrixGrid[index].receivedQty = 0;
        }
       let preRcvqty=0;
       if(this.MatrixGrid[indexx].previouslyReceviedQty){
        preRcvqty= this.MatrixGrid[indexx].previouslyReceviedQty
       }
       
       let Rcvcqty= this.MatrixGrid[indexx].receivedQty;
       let shippedQty= Number(this.MatrixGrid[indexx].shippedQty);
       let tot=Number(preRcvqty)+(Number(Rcvcqty));
       if(tot>shippedQty){
        this.MatrixGrid[indexx].receivedQty=null;
        this.MatrixGrid[indexx].receivedQty=0;
        
         this.toastr.warning('Total recevied quantity should be less than shipped quantity'); 
         return;
       }
        this.totalsum();
      }
  onMatrixCheckReceive(searchValue, id): void {
    if (!searchValue) {
      let index = this.MatrixGrid.findIndex(c => c.id == id);
      this.MatrixGrid[index].receivedQty = 0;
    }
    this.totalsum();
  }
  totalsum() {
    var Jlist = this.MatrixGrid.filter(function (e) { return e.receivedQty != null; });
    console.log(Jlist);
    this.totalQuantity = Jlist.reduce((sum, item) => sum + parseInt(item.receivedQty), 0);
    //  this.totalQuantity = this.SerialList.reduce((sum, item) => sum + parseInt(item.receivedQty), 0);
  }

  onColumnNameSelected(event) {
    debugger;
    this.colName = event;
    let obj = {
      'companyID': localStorage.getItem('CompanyID'),
      'productID': this.ProductID,
      'warehouseID': this.WareHouseFromID,
      'adjustmentRefID': this.SelectedTransferDetail_ID,
      'columnName': this.colName
    }

    this.transferdetailStockOutService.getInventoryTransferSortColumns(localStorage.getItem('CompanyID'), this.ProductID, this.WareHouseFromID, this.SelectedTransferDetail_ID, this.colName).subscribe((resp: any) => {
      this.IsSubmit = false;
      this.MatrixGrid = resp.data.sortColumns;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
}

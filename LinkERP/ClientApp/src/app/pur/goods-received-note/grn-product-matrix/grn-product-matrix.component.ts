import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { WareHouseBinService } from 'src/app/inv/services/ware-house-bin.service';
import { GoodsReceivedNotesService } from '../../services/goods-received-notes.service';
import { PurchaseOrderDetailService } from '../../services/purchase-order-detail.service';

@Component({
  selector: 'app-grn-product-matrix',
  templateUrl: './grn-product-matrix.component.html',
  styleUrls: ['./grn-product-matrix.component.css']
})
export class GrnProductMatrixComponent implements OnInit {

  /* @Input() ProductID: any;
  @Input() SelectedPurchaseDetail_ID: any;  
  @Input()SelectedQuantity: any; 
   @Output() OnCancel = new EventEmitter(); 
   @Input() PurchaseStatus: string;  */
  //InvProductStyleTransferMatrixobj: any = new InvProductStyleMatrixTransfer();
 // productStyleTransferMatrixColumn: any = new ProductStyleTransferMatrixColumn();
 // TransferMatrixDetaillist: any = new TransferMatrixDetail();
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
      private wareHouseBinService: WareHouseBinService 
    ) { }

  ngOnInit() {
    //this.ProductMatrixList = [];
   // console.log(this.RequisitionStatus)
   //this.ProductID=''
    this.submitted = false;
   // this.BindWareHouseBins();
    this.getTransferProductMatrixByRecID();
    this.SelectedRowID = '';
    this.filterargs = { 'productMatrixRow': '' };
  }
  
  BindWareHouseBins() {
   /*  this.wareHouseBinService.getWareHouseBinByWareHouseID(this.WareHouseToID).subscribe((resp: any) => {
      this.BinList = resp.data.warehousebin;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    }); */
  }

  

  getTransferProductMatrixByRecID() {
    this.goodsReceivedNotesService.getProductMatrixByRecID('this.ProductID','this.SelectedPurchaseDetail_ID').subscribe((resp: any) => {
      debugger;
      this.Resultlist = [];
      this.ProductStyleMatrixRow = resp.data.purchasematrix.productStyleMatrixRow;
      this.ProductStyleMatrixColumn = resp.data.purchasematrix.productStyleMatrixColumn;
      this.GRNDetailsProductStyleMatrix = resp.data.purchasematrix.lbS_PUR_PurchaseDetailsProductStyleMatrix;
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
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }


  UpdateChanges(From) {
    console.log(this.Resultlist)
    debugger;
    this.submitted = true; 
      /* this.purchaseOrderDetailService.updatepurchaseDetailsProductStyleMatrixList(this.Resultlist).subscribe((resp: any) => {
        this.submitted = false;
        this.toastr.success('Purchase order details Saved successfully');
        if (From == 'Close') {
         // this.OnCancel.emit();
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
        this.submitted = false;
      });  */
  }

  myFunc(id, index) {
    this.selectedRow = [];
    this.selectedRow[index] = true;
    this.SelectedRowID = id;
    let Checkindex = this.Resultlist.findIndex(c => c.productMatrixRow == id);
    if (Checkindex < 0) {
      for (let i = 0; i < this.ProductStyleMatrixColumn.length; i++) {
        let TempResultlist = this.GRNDetailsProductStyleMatrix.filter(item => item['productMatrixRow'] === id && item['productMatrixColumn'] === this.ProductStyleMatrixColumn[i].id && item['purchaseDetailID'] === 'this.SelectedPurchaseDetail_ID');
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
          //'purchaseDetailID': this.SelectedPurchaseDetail_ID,
          //'productID': this.ProductID, 
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
   // this.OnCancel.emit();
    this.submitted = false;
  }

}

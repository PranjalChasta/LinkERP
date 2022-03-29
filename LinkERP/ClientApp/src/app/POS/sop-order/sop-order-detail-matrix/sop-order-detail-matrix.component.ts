import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { SopOrderService } from '../../services/sop-order.service';


@Component({
  selector: 'app-sop-order-detail-matrix',
  templateUrl: './sop-order-detail-matrix.component.html',
  styleUrls: ['./sop-order-detail-matrix.component.css']
})
export class SopOrderDetailMatrixComponent implements OnInit {
  @Input() LineNum;
  @Input() SalesOrderDetailID;
  @Input() InventoryId;
  @Input() WarehouseID;
  @Output() Cancel = new EventEmitter();
  @Output()  ProductMatrixSave = new EventEmitter<{ProductStyleMatrixForSave:any[], Total:any}>();


  submitted: boolean;
  BinList: any;
  totalQuantity: number = 0;
  ProductStyleMatrixRow: any;
  ProductStyleMatrixColumn: any;
  OrderDetailProductStyleMatrix: any;
  Resultlist: any;
  filterargs: any;
  selectedRow: boolean[] = [];
  IsuseExpiryDates: boolean;
  ColumnName;
  RowName;
  SelectedRowID: any;
  //WareHouseID: any="00000000-0000-0000-0000-000000000000";
  CompanyID: any=localStorage.getItem('CompanyID');
  ProductStyleMatrix:any[]=[];
  ProductStyleMatrixForSave:any=[];

  constructor(
    private toastr: ToastrService,
    private sopOrderService: SopOrderService,
    private invCommonService: InvCommonService,
  ) { }

  ngOnInit() {
    this.SelectedRowID = '';
    this.submitted = false;
    this.BindWareHouseBins();
    this.GetProductStyleMatrix();
    //this.getOrderDetilProductMatrixByRecID();
    this.filterargs = { 'productMatrixRow': '' };
  }
  GetProductStyleMatrix(){
    
    this.sopOrderService.getProductStyleMatrix(this.CompanyID,this.InventoryId,this.WarehouseID).subscribe((resp: any) => {
console.log(resp)
this.ProductStyleMatrix=[];
this.ProductStyleMatrix=resp.data.productMatrix;
      debugger;
      //this.ProductStyleMatrixRow = resp.data.productMatrix.productStyleMatrixRow;
      
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  // CheckInventory() {
  //   this.inventoryService.getInventoryByID(this.ProductID).subscribe((resp: any) => {
  //     if (resp.isSuccess) {
  //       console.log(resp.data.inventorydetails.useExpiryDates); 
  //       if(resp.data.inventorydetails.useExpiryDates){
  //         this.IsuseExpiryDates=true;
  //       }else{
  //         this.IsuseExpiryDates=false;
  //       }
  //     }
  //   }, (error) => {
  //     this.toastr.error(error);
  //     console.error('Problem with the sevice. Please try later : ' + error);
  //   });
  // }

  BindWareHouseBins() {
    this.invCommonService.getWareHouseBinByWareHouseID(this.WarehouseID).subscribe((resp: any) => {
      this.BinList = resp.data.warehousebin;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  getOrderDetilProductMatrixByRecID() {
    debugger;
    this.sopOrderService.getSalesOrderProductMatrixByRecID(this.SalesOrderDetailID, this.InventoryId).subscribe((resp: any) => {
      this.Resultlist = [];
      debugger;
      this.ProductStyleMatrixRow = resp.data.productMatrix.productStyleMatrixRow;
      this.ProductStyleMatrixColumn = resp.data.productMatrix.productStyleMatrixColumn;
      this.OrderDetailProductStyleMatrix = resp.data.productMatrix.lbS_SOP_OrderDetailProductStyleMatrix;
      if (this.ProductStyleMatrixRow.length > 0) {
        this.RowName = this.ProductStyleMatrixRow[0].styleMatrixDetailCode
      }
      if (this.ProductStyleMatrixColumn.length > 0) {
        this.ColumnName = this.ProductStyleMatrixColumn[0].styleMatrixDetailCode
      }
      console.log(resp.data.productMatrix);
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


  UpdateChanges(SaveAction) {
    console.log(this.ProductStyleMatrix);
    this.ProductStyleMatrix.forEach(PSM => {
      if (PSM.transactionQuantity>0)
      {
       this.ProductStyleMatrixForSave.push(PSM);
      }       
});
console.log(this.ProductStyleMatrixForSave)
this.ProductMatrixSave.emit({ProductStyleMatrixForSave: this.ProductStyleMatrixForSave, Total:this.totalQuantity});
this.Cancel.emit();
    // console.log(this.Resultlist)
    // this.submitted = true;
    // this.sopOrderService.updateSalesOrderProductStyleMatrixList(this.Resultlist).subscribe((resp: any) => {
    //   this.submitted = false;
    //   this.toastr.success('Sales Order details matrix Saved successfully');
    //   if (SaveAction == 'Close') {
    //     this.Cancel.emit();
    //   }
    // }, (error) => {
    //   console.error('Problem with the sevice. Please try later : ' + error);
    // });
  }

  myFunc(id, index) {
    this.selectedRow = [];
    this.selectedRow[index] = true;
    this.SelectedRowID = id;
    let Checkindex = this.Resultlist.findIndex(c => c.productMatrixRow == id);
    if (Checkindex < 0) {
      for (let i = 0; i < this.ProductStyleMatrixColumn.length; i++) {
        let TempResultlist = this.OrderDetailProductStyleMatrix.filter(item => item['productMatrixRow'] === id && item['productMatrixColumn'] === this.ProductStyleMatrixColumn[i].id && item['salesOrderDetailID'] === this.SalesOrderDetailID);
        let Binid = '00000000-0000-0000-0000-000000000000';
        let Quantity = 0;
        let Pid = "";
        if (TempResultlist.length > 0) {
          Binid = TempResultlist[0].binID;
          Quantity = TempResultlist[0].transactionQuantity;
          Pid = TempResultlist[0].id;
        }
        let object = {
          'companyID': localStorage.getItem('CompanyID'),
          'salesOrderDetailID': this.SalesOrderDetailID,
          'orderDetailLineNum': this.SalesOrderDetailID,
          'productID': this.InventoryId,
          'binID': Binid,
          'productMatrixRow': id,
          'productMatrixColumn': this.ProductStyleMatrixColumn[i].id,
          'serialNo': null,
          'transactionQuantity': 0,
          'styleMatrixName': this.ProductStyleMatrixColumn[i].styleMatrixDetailName,
          'id': Pid,
          'createdBY': localStorage.getItem('LoginID')

        }
        this.Resultlist.push(object);
      }
      this.totalsum();
    }
  }
  onSearchChange(searchValue, i): void {
    var SaleQty = searchValue
    if (SaleQty==null|| SaleQty=="")
    {
        SaleQty =0;
        this.ProductStyleMatrix[i].transactionQuantity=0;
    }
    var QtyInStock =this.ProductStyleMatrix[i].quantityOnHand
    if (QtyInStock == null || QtyInStock == "")
    {
        QtyInStock = 0;
    }
    if(Number(SaleQty) > Number(QtyInStock))
    {
      this.toastr.warning('QtyInStock can not  be gretter then SaleQty');
       //alert("QtyInStock can not  be gretter then SaleQty");
        this.ProductStyleMatrix[i].transactionQuantity=0;
    }
    // if (!searchValue) {
    //   this.Resultlist[i].transactionQuantity = 0;
    // }
    // this.Resultlist[i].transactionQuantity = +searchValue;
    this.totalsum();
  }
  totalsum() {

    this.totalQuantity = this.ProductStyleMatrix.reduce((sum, item) => sum + parseInt(item.transactionQuantity), 0);
  }
  OnCancel() {
    this.submitted = false;
    this.Cancel.emit();
  }

}

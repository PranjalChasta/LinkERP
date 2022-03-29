import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { CustomValidators } from 'ngx-custom-validators';
import { LBSINVInventoryStockTakeDetailProductStyleMatrix } from 'src/app/models/inv/lbs-inv-inventory-stock-take-detail-product-style-matrix';
import { InventoryService } from '../../services/inventory.service';
import { WareHouseBinService } from '../../services/ware-house-bin.service';
import { ProductStyleMatrixService } from '../../services/product-style-matrix.service';
import { InvCommonService } from '../../services/inv-common.service';
import { InventoryStockTakeDetailProductStyleMatrixService } from '../../services/inventory-stock-take-detail-product-style-matrix.service';

@Component({
  selector: 'app-inventory-stock-take-detail-product-style-matrix',
  templateUrl: './inventory-stock-take-detail-product-style-matrix.component.html',
  styleUrls: ['./inventory-stock-take-detail-product-style-matrix.component.css']
})
export class InventoryStockTakeDetailProductStyleMatrixComponent implements OnInit {
  Mode: any = 'List';
  Submitted: any = false;
  CompanyID = localStorage.getItem('CompanyID');
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  Loading: any = false;
  ProductsList: any;
  BindInventoryStockTakeDetail: any;
  BinName: any;
  ProductMatrixRow: any;
  ProductMatrixColumn: any;
  StockTake: any;
  StockTakeDetailProductStyleMatrixForm: FormGroup

  constructor(
    private toastr: ToastrService,
    private FB: FormBuilder,
    private deleteRecordsService: DeleteRecordsService,
    private inventoryService: InventoryService,
    private wareHouseBinService: WareHouseBinService,
    private productStyleMatrixService: ProductStyleMatrixService,
    private invCommonService: InvCommonService,
    private sysCommonService: SysCommonService,
    private inventoryStockTakeDetailProductStyleMatrixService: InventoryStockTakeDetailProductStyleMatrixService
  ) { }

  ngOnInit() {
    this.AgLoad = false;
    this.CreateForm();
    this.ColumnDefs = [
      { headerName: 'Stock Status', field: 'stockTakeStatus', sortable: true, filter: true, checkboxSelection: false, },
      { headerName: ' Serial No', field: 'serialNo', sortable: true, filter: true },
      { headerName: 'Source Reference ', field: 'sourceReference', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', cellRenderer: this.CustomEditIconFunc, type: 'Action', hide: false },
      { headerName: '', field: 'Delete', cellRenderer: this.CustomDeleteIconFunc, type: 'Action', hide: false }
    ];
    this.BindInventoryStockTakeDetails();
    this.BindProductStyleMatrixes();
    this.BindProducts();
    this.BindInventoryStocks();
    this.BindProductStyleMatrix();
    this.BindWareHouseBins();
  }
  //To Create a Form
  CreateForm() {
    this.StockTakeDetailProductStyleMatrixForm = this.FB.group({
      ID: [''],
      StockTakeNo: ['-1', CustomValidators.notEqual('-1')],
      ProductID: ['-1', CustomValidators.notEqual('-1')],
      BinID: ['-1', CustomValidators.notEqual('-1')],
      ProductMatrixRow: ['-1'],
      ProductMatrixColumn: ['-1'],
      SerialNo: ['', Validators.required],
      SourceReference: ['', Validators.required],
      TransactionDateIn: [''],
      ExpiryDate: [''],
      CurrentAvailableQuantity: [''],
      CountQuantity: [''],
      VarianceQuantity: [''],
    });
  }
  get f() { return this.StockTakeDetailProductStyleMatrixForm.controls; }
  //To bind all the data to the Grid
  BindInventoryStockTakeDetails() {
    this.Mode = "List";
    this.AgLoad = false;
    this.inventoryStockTakeDetailProductStyleMatrixService.getAllInventoryStockTakeDetailProductStyleMatrix().subscribe((resp: any) => {
      this.BindInventoryStockTakeDetail = resp.data.stockdetail;
      this.RowData = resp.data.stockdetail;
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To display the data of InventoryStockTakes for dropdown
  BindInventoryStocks() {
    this.invCommonService.getInventoryStockTakes().subscribe((resp: any) => {
      this.StockTake = resp.data.inventorystocktakes;
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To display the data of Products for dropdown
  BindProducts() {
    this.sysCommonService.getParentProductKits().subscribe((resp: any) => {
      this.ProductsList = resp.data.productkits;
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To display the data of BinName for dropdown
  BindWareHouseBins() {
    this.invCommonService.getWareHouseBins().subscribe((resp: any) => {
      this.BinName = resp.data.wareHouseBins;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To display the data of ProductMatrixRow for dropdown
  BindProductStyleMatrixes() {
    this.invCommonService.getProductStyleMatrix().subscribe((resp: any) => {
      this.ProductMatrixRow = resp.data.productmatrix;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To display the data of ProductMatrixColumn for dropdown
  BindProductStyleMatrix() {
    this.invCommonService.getProductStyleMatrix().subscribe((resp: any) => {
      this.ProductMatrixColumn = resp.data.productmatrix;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To Add new InventoryStockTakeDetails
  AddNew() {
    this.Mode = 'Add';
  }
  //Cancel the Add/Edit
  Cancel() {
    this.Mode = 'List';
    let InventoryStockTakeDetails = {
      stockTakeNo: ['-1'],
      productID: ['-1'],
      binID: ['-1'],
      productMatrixRow: ['-1'],
      productMatrixColumn: ['-1'],
      serialNo: [''],
      sourceReference: ['']
    };
    this.BindInventoryStockTake(InventoryStockTakeDetails);
  }
  //To save the Inventory StockTake Details  to database table by calling the API service
  onSave() {
    this.Submitted = true;
    if (this.StockTakeDetailProductStyleMatrixForm.invalid) {
      return;
    }
    let inventorystocktake = new LBSINVInventoryStockTakeDetailProductStyleMatrix();
    inventorystocktake.CompanyID = this.CompanyID;
    inventorystocktake.StockTakeNo = this.StockTakeDetailProductStyleMatrixForm.get('StockTakeNo').value;
    inventorystocktake.ProductID = this.StockTakeDetailProductStyleMatrixForm.get('ProductID').value;
    inventorystocktake.BinID = this.StockTakeDetailProductStyleMatrixForm.get('BinID').value;
    inventorystocktake.ProductMatrixRow = this.StockTakeDetailProductStyleMatrixForm.get('ProductMatrixRow').value;
    inventorystocktake.ProductMatrixColumn = this.StockTakeDetailProductStyleMatrixForm.get('ProductMatrixColumn').value;
    inventorystocktake.SerialNo = this.StockTakeDetailProductStyleMatrixForm.get('SerialNo').value;
    inventorystocktake.SourceReference = this.StockTakeDetailProductStyleMatrixForm.get('SourceReference').value;
    inventorystocktake.TransactionDateIn = this.StockTakeDetailProductStyleMatrixForm.get('TransactionDateIn').value;
    inventorystocktake.ExpiryDate = this.StockTakeDetailProductStyleMatrixForm.get('ExpiryDate').value;
    inventorystocktake.CurrentAvailableQuantity = this.StockTakeDetailProductStyleMatrixForm.get('CurrentAvailableQuantity').value;
    inventorystocktake.CountQuantity = this.StockTakeDetailProductStyleMatrixForm.get('CountQuantity').value;
    inventorystocktake.VarianceQuantity = this.StockTakeDetailProductStyleMatrixForm.get('VarianceQuantity').value;
    //If the mode Add will insert data to DB table else update the row by ID
    if (this.Mode == 'Add') {
      this.inventoryStockTakeDetailProductStyleMatrixService.addinventorystocktakedetailsproductStleMatrix(inventorystocktake).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success(' Inventory stock take details added successfully');
          this.BindInventoryStockTakeDetails();
          this.Mode = 'List';
          this.Loading = false;
        }
      });
    }
    else if (this.Mode == 'Edit') {
      inventorystocktake.ID = this.StockTakeDetailProductStyleMatrixForm.get('ID').value;
      this.inventoryStockTakeDetailProductStyleMatrixService.updateInventoryStockTakeDetailProductStyleMatrix(inventorystocktake).subscribe((resp: any) => {
        this.toastr.success('Inventory stock take details updated successfully')
        {
          this.BindInventoryStockTakeDetails();
          this.Mode = 'List';
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
  }
  BindInventoryStockTake(event) {
    this.StockTakeDetailProductStyleMatrixForm.patchValue({
      ID: event.id,
      StockTakeNo: event.stockTakeNo,
      ProductID: event.productID,
      BinID: event.binID,
      ProductMatrixRow: event.productMatrixRow,
      ProductMatrixColumn: event.productMatrixColumn,
      SerialNo: event.serialNo,
      SourceReference: event.sourceReference,
      TransactionDateIn: event.transactionDateIn,
      ExpiryDate: event.expiryDate,
      CurrentAvailableQuantity: event.currentAvailableQuantity,
      CountQuantity: event.countQuantity,
      VarianceQuantity: event.varianceQuantity
    })
  }
  //Delete the record
  onDeleteChecked(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_INV_InventoryStockTakeDetailProductStyleMatrix', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.BindInventoryStockTakeDetails();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //For AG-Grid
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.Mode = 'Edit';
      this.BindInventoryStockTake(event.data)

    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.id)
    }
  }
  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-pencil"></i></div>';
    return cellContent
  }
  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }
  

}

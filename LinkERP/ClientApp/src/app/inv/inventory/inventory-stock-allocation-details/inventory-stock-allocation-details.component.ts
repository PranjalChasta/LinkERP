import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WarehouseService } from '../../services/warehouse.service';
import { WareHouseBinService } from '../../services/ware-house-bin.service';
import { InventoryStockAllocationDetailsService } from '../../services/inventory-stock-allocation-details.service';
import { DatePipe } from '@angular/common'
import { ToastrService } from 'ngx-toastr';
import { ProductStyleMatrixService } from '../../services/product-style-matrix.service';
import { InvCommonService } from '../../services/inv-common.service';
import { LBSINVInventoryStockAllocationDetails } from 'src/app/models/inv/lbs-inv-inventory-stock-allocation-details';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { CustomValidators } from 'ngx-custom-validators';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { SharedFormatterService } from 'src/app/shared/services/shared-formatter.service';

@Component({
  selector: 'app-inventory-stock-allocation-details',
  templateUrl: './inventory-stock-allocation-details.component.html',
  styleUrls: ['./inventory-stock-allocation-details.component.css']
})
export class InventoryStockAllocationDetailsComponent implements OnInit {
  @Input() InventryID: any;
  @Input() WarehouseID: any;
  @Output() OnCancelAllocation = new EventEmitter<any>();
  Mode: any = 'List';
  submitted: any = false;
  Loading: any = false;

  //Permission
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;

  WareHouse: any[] = [];//Array variable of WareHouse data to bind grid
  BindInventoryStockDetail: any[] = [];//Array variable of BindInventoryStockDetail data to bind grid
  ProductStyleMatrix: any[] = [];//Array variable of ProductStyleMatrix data to bind grid
  WareHouseBins: any;
  ProductStyleMatrixDetail: any[] = [];
  InventoryStockAllocationDetailsForm: FormGroup;
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  PageSize: any;
  Currentpage: string;
  CompanyId = localStorage.getItem('CompanyID');
  read: boolean;
  constructor(
    private deleteRecordsService: DeleteRecordsService,
    private invCommonService: InvCommonService,
    private productstyle: ProductStyleMatrixService,
    private toastr: ToastrService,
    private stockservice: InventoryStockAllocationDetailsService,
    private wareHouseBinService: WareHouseBinService,
    private warehouseService: WarehouseService,
    private FB: FormBuilder,
    private cryptoAes: CryptoAes,
    private sharedFormatterService: SharedFormatterService, public datepipe: DatePipe
  ) { }

  ngOnInit() {
    // alert(this.WarehouseID + ' ' + this.InventryID);
    this.AgLoad = false;
    this.Currentpage = "0";
    this.PageSize = "50";
    this.BindInventoryStockDetails();
    this.BindWareHouse();
    this.GetProductStyleMatrix();
    this.getProductStyleMatrixDetails();
    //To create the InventoryStockAllocationDetailsForm Form Controls.
    this.InventoryStockAllocationDetailsForm = this.FB.group({
      ID: [''],
      WareHouseName: ['-1', CustomValidators.notEqual('-1')],
      ProductStyleMatrixColumn: ['-1'],
      BinName: ['-1', CustomValidators.notEqual('-1')],
      ProductStyleMatrixRow: ['-1'],
      SerialNo: ['', Validators.required],
      TransactionDateIn: [''],
      ExpiryDate: [''],
      Quantity: ['', Validators.required],
      CostIn: ['', Validators.required],
      SourceReference: ['', Validators.required]
    })
    this.SetPermissions();
    this.ColumnDefs = [
      { headerName: 'Source Reference', field: 'sourceReference', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Bin Name', field: 'binName', sortable: true, filter: true, checkboxSelection: false, width: 150 },
      { headerName: 'Matrix Row ', field: 'productMatrixRowname', sortable: true, filter: true, checkboxSelection: false, width: 200 },
      { headerName: 'Matrix Column', field: 'productMatrixColumnname', sortable: true, filter: true, width: 200 },
      { headerName: 'SerialNo', field: 'serialNo', sortable: true, filter: true, width: 150 },
      { headerName: 'Quantity In', field: 'quantityIn', sortable: true, filter: true, width: 150 },
      { headerName: 'Quantity On Hand', field: 'quantityOnHand', sortable: true, filter: true, width: 150 },
      { headerName: 'Transaction Date', field: 'transactionDateIn', sortable: true, filter: true, width: 150, valueFormatter: this.sharedFormatterService.dateTimeFormatter },
      { headerName: 'Expiry Date', field: 'expiryDate', sortable: true, filter: true, width: 150 },
      { headerName: 'Cost', field: 'costIn_text', sortable: true, filter: true },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, }
    ];
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  SetPermissions() {
    debugger;
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "201");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.InventoryStockAllocationDetailsForm.enable();

      if (!this.all_Access) {
        if (!this.write_Access) {
          this.InventoryStockAllocationDetailsForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.InventoryStockAllocationDetailsForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }


  get f() { return this.InventoryStockAllocationDetailsForm.controls; }
  //Cancel the Add/Edit
  Cancel() {
    this.ResetForm();
    //this.OnCancelAllocation.emit();
    this.Mode = 'List';
  }
  Back() {
    debugger;
    this.OnCancelAllocation.emit("");
  }
  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-pencil"></i></div>';
    return cellContent
  }
  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }
  onWareHouseChange(ID) {
    this.WareHouseBins = [];
    if (ID != "-1") {
      this.wareHouseBinService.getWareHouseBinByWareHouseID(ID).subscribe((resp: any) => {
        this.WareHouseBins = resp.data.warehousebin;

      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
  }
  //To bind the data of all BindWareHouse to the Grid.
  BindWareHouse() {
    this.Loading = true;
    this.warehouseService.getWareHouse().subscribe((resp: any) => {
      this.WareHouse = resp.data.warehouse;
      this.Loading = false;

    }, (error) => {
      //  console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //To bind the data of all GetProductStyleMatrix to the Grid.
  GetProductStyleMatrix() {

    this.invCommonService.getProductStyleMatrix().subscribe((resp: any) => {
      this.ProductStyleMatrix = resp.data.productmatrix;
      console.log(this.ProductStyleMatrix)
      console.log("ooow")
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  getProductStyleMatrixDetails() {

    this.invCommonService.getProductStyleMatrixDetails().subscribe((resp: any) => {
      this.ProductStyleMatrixDetail = resp.data.productstylematrixdetails;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To bind the data of all BindInventoryStockDetails to the Grid.
  BindInventoryStockDetails() {
    debugger;
    this.Mode = "List";
    this.AgLoad = false;
    this.stockservice.getStockAllocationDetailsByInventoryAndWarehouse(this.InventryID, this.WarehouseID).subscribe((resp: any) => {
      this.BindInventoryStockDetail = resp.data.inventorystockallocationdetails;
      debugger;
      for (let i = 0; i < this.BindInventoryStockDetail.length; i++) {
        resp.data.inventorystockallocationdetails[i].expiryDate = resp.data.inventorystockallocationdetails[i].expiryDate == null ? '' : this.datepipe.transform(resp.data.inventorystockallocationdetails[i].expiryDate, 'dd/MM/yyyy hh:mm a');
        this.RowData = resp.data.inventorystockallocationdetails;
        console.log(this.RowData);
      }
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      // console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  AddNew() {
    this.Mode = 'Add';
    this.read = false;
  }

  //To save the stock details to database table by calling the API service
  onSave() {
    this.submitted = true;
    if (this.InventoryStockAllocationDetailsForm.invalid) {
      return;
    }
    this.Loading = true;
    let stock = new LBSINVInventoryStockAllocationDetails();
    stock.CompanyID = this.CompanyId;
    stock.ProductID = this.InventryID;
    stock.CreatedBY = localStorage.getItem('LoginID');
    stock.WarehouseID = this.InventoryStockAllocationDetailsForm.get('WareHouseName').value;
    stock.BinID = this.InventoryStockAllocationDetailsForm.get('BinName').value;
    stock.ProductMatrixRow = this.InventoryStockAllocationDetailsForm.get('ProductStyleMatrixRow').value;
    stock.ProductMatrixColumn = this.InventoryStockAllocationDetailsForm.get('ProductStyleMatrixColumn').value;
    stock.SerialNo = this.InventoryStockAllocationDetailsForm.get('SerialNo').value;
    stock.TransactionDateIn = this.InventoryStockAllocationDetailsForm.get('TransactionDateIn').value;
    stock.ExpiryDate = this.InventoryStockAllocationDetailsForm.get('ExpiryDate').value;
    stock.Quantity = this.InventoryStockAllocationDetailsForm.get('Quantity').value;
    stock.CostIn = this.InventoryStockAllocationDetailsForm.get('CostIn').value;
    stock.SourceReference = this.InventoryStockAllocationDetailsForm.get('SourceReference').value;
    if (this.Mode == 'Add') {
      //If the mode Add will insert data to DB table else update the row by ID
      this.stockservice.addInventoryStockAllocationDetails(stock).subscribe((resp: any) => {

        this.toastr.success('Inventory UOM Details added successfully')
        this.ResetForm();
        this.BindInventoryStockDetails();
        this.Mode = 'List';
        this.Loading = false;
      }, (error) => {
        //   console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
    else if (this.Mode == 'Edit') {

      stock.ID = this.InventoryStockAllocationDetailsForm.get('ID').value;
      this.stockservice.updateInventoryStockAllocationDetails(stock).subscribe((resp: any) => {

        this.toastr.success('Inventory UOM Details updated successfully')
        this.ResetForm();
        this.BindInventoryStockDetails();
        this.Mode = 'List';

      }, (error) => {
        //  console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
  }
  //Resetting the form after Add/Edit
  ResetForm() {
    this.InventoryStockAllocationDetailsForm.patchValue({
      ID: '',
      WareHouseName: '-1',
      ProductStyleMatrixColumn: '-1',
      BinName: '-1',
      ProductStyleMatrixRow: '-1',
      SerialNo: '',
      TransactionDateIn: '',
      ExpiryDate: '',
      Quantity: '',
      CostIn: '',
      SourceReference: ''

    });
  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {

    var colId = event.column.getId();
    if (colId == 'Edit') {

      this.Mode = 'Edit'
      this.AgEdit(event.data)
    } else if (colId == 'Delete') {

      this.onDelete(event.data.id)
    }
  }
  /* FOR Aggird end */

  //edit operation
  AgEdit(event) {
    debugger;
    this.GetProductStyleMatrix();
    console.log(event);
    console.log("sdkm");
    this.read = true;
    this.InventoryStockAllocationDetailsForm.patchValue({
      ID: event.id,
      WareHouseName: event.wareHouseID,
      BinName: event.binID,
      ProductStyleMatrixRow: event.productMatrixRow,
      ProductStyleMatrixColumn: event.productMatrixColumn,
      TransactionDateIn: event.transactionDateIn,
      SerialNo: event.serialNo,
      ExpiryDate: event.expiryDate,
      Quantity: event.quantityIn,
      CostIn: event.costIn,
      SourceReference: event.sourceReference

    });
    this.onWareHouseChange(event.wareHouseID)
    this.InventoryStockAllocationDetailsForm.get('TransactionDateIn').disable();
    this.InventoryStockAllocationDetailsForm.get('ExpiryDate').disable();
    this.Mode = 'Edit';
  }
  Edit(ID) {

    this.stockservice.getInventoryStockAllocationDetailsByID(ID).subscribe((resp: any) => {
      let rates: any = new LBSINVInventoryStockAllocationDetails();
      rates = resp.data.inventorydetails;
      this.InventoryStockAllocationDetailsForm.patchValue({
        ID: rates.id,
        WareHouseName: rates.wareHouseID,
        BinName: rates.binID,
        ProductStyleMatrixRow: rates.productMatrixRow,
        ProductStyleMatrixColumn: rates.productMatrixColumn,
        SerialNo: rates.serialNo,
        TransactionDateIn: rates.transactionDateIn,
        ExpiryDate: rates.expiryDate,
        Quantity: rates.quantity,
        CostIn: rates.costIn,
        SourceReference: rates.sourceReference

      });
      this.Mode = 'Edit';

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }
  //delete record
  onDelete(ID) {

    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_INV_InventoryStockAllocationDetails', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      // this.toastr.success('Currency  details deleted successfully');
      this.BindInventoryStockDetails();
      this.ResetForm();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
}

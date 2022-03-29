import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InventoryStockTakeService } from '../services/inventory-stock-take.service';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { GenricTableIDByName } from 'src/app/shared/enums/enum-generictables';
import { WarehouseService } from '../services/warehouse.service';
import { WareHouseBinService } from '../services/ware-house-bin.service';
import { LBSINVInventoryStockTake } from 'src/app/models/inv/lbs-inv-inventory-stock-take';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { InventoryService } from '../services/inventory.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { CustomValidators } from 'ngx-custom-validators';
import { InvCommonService } from '../services/inv-common.service';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-inventory-stock-take',
  templateUrl: './inventory-stock-take.component.html',
  styleUrls: ['./inventory-stock-take.component.css']
})
export class InventoryStockTakeComponent implements OnInit {
  InventoryStockTakeForm: FormGroup;
  Loading: any = false;
  Mode: any = 'List';
  submitted: boolean;
  CompanyID = localStorage.getItem('CompanyID');
  //Permission
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  SelectedStockTakeID: any;
  inventorystocktakeroute: any;
  //Ag-grid 
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false
  Inventorystocktake: any[] = [];
  BindWareHouseBin: any[] = [];
  WareHouse: any[];
  BindInventory: any[] = [];
  HeaderNames: any;
  AccessTab: string;
  SelectedStockTakeNo: any;
  CycleList;
  SubCategoryStartList;
  SubCategoryEndList;
  CategoryStartList;
  CategoryEndList;
  StockTakeStatus: any;
  isStockApprover: boolean;
  isStockCreater: boolean;
  stock_create_read_Access: boolean;
  stock_create_write_Access: boolean;
  stock_create_delete_Access: boolean;
  stock_create_all_Access: boolean;
  stock_approve_read_Access: boolean;
  stock_approve_write_Access: boolean;
  stock_approve_delete_Access: boolean;
  stock_approve_all_Access: boolean;
  SelectedWareHouseID: any;
  Cycle_list: any;
  PageSize: any;
  Currentpage: string;
  IsDetail: boolean;
  BlindStockTake: any;
  showInStock: Boolean;
  IsActive: boolean;
  constructor(private deleteRecordsService: DeleteRecordsService,
    private cryptoAes: CryptoAes,
    private invCommonService: InvCommonService,
    private inventoryservice: InventoryService,
    private wareHouseBinService: WareHouseBinService,
    private sysCommonService: SysCommonService,
    private WareHouseService: WarehouseService,
    private stocktake: InventoryStockTakeService,
    private FB: FormBuilder, private toastr: ToastrService,
    private route: ActivatedRoute, private router: Router) {
    this.inventorystocktakeroute = this.route.snapshot.paramMap.get("id");
  }

  ngOnInit() {
    this.AgLoad = false;
    this.Mode = "List";
    //this.isApprover=false;
    this.HeaderNames = "Stock";
    this.AccessTab = "Stock";
    this.InventoryStockTakeForm = this.FB.group({
      ID: [''],
      CompanyID: [''],
      StockTakeNo: [''],
      WareHouseID: ['-1', CustomValidators.notEqual('-1')],
      CycleID: [''],
      ProductIDStart: [''],
      ProductIDEnd: [''],
      CategoryIDStart: [''],
      CategoryIDEnd: [''],
      SubCategoryIDStart: [''],
      SubCategoryIDEnd: [''],
      BinIDStart: [''],
      BinIDEnd: [''],
      StockTakeStatus: ['']
    });
    //this.CreateForm();
    this.SetPermissions();
    this.GetAgColumns();
    this.BindInventoryStockTake();
    this.BindCategory();
    this.BindWareHouse();
    // this.BindWareHouseBins();
    this.BindInventories();
    this.BindCycle();
    this.GetCycle();
    this.SetStockCreatePermissions();
    this.SetStockApprovePermissions();
    this.Currentpage = "0";
    this.PageSize = "50";
    // this.BlindStockTake = this.invCommonService.getConfigurationByFlag('Flag5');
    // this.showInStock = this.BlindStockTake == 'N' ? true : false;
    // if (this.BlindStockTake != null) {
    //   alert(this.BlindStockTake + ' ' + this.showInStock)
    // }

    this.GetBlindStockTake();
  }

  GetBlindStockTake() {

    this.invCommonService.getConfigurationByFlag('Flag5').subscribe((resp: any) => {
      this.BlindStockTake = resp.data.configuration.value;
      this.showInStock = this.BlindStockTake == 'N' ? true : false;
      // alert(this.showInStock);
    }, (error: any) => {

    });
  }


  GetAgColumns() {
    this.ColumnDefs = [
      { headerName: 'StockTakeNo', field: 'stockTakeNo', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'WareHouse', field: 'wareHouseName', sortable: true, filter: true },
      { headerName: 'Cycle', field: 'cyclename', sortable: true, filter: true },
      { headerName: 'Product Start ', field: 'productName', sortable: true, filter: true },
      { headerName: 'Product End ', field: 'productEndName', sortable: true, filter: true },
      { headerName: 'Stock Take Status ', field: 'stockTakeStatus', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', cellRenderer: this.CustomEditIconFunc, type: 'Action', hide: !this.write_Access },
      { headerName: '', field: 'Delete', type: 'DeleteActionStockTake', hide: !this.delete_Access }
    ];
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  CreateForm() {
    this.InventoryStockTakeForm = this.FB.group({
      ID: [''],
      CompanyID: ['-1'],
      StockTakeNo: [''],
      WareHouseID: ['-1', CustomValidators.notEqual('-1')],
      CycleID: ['-1'],
      ProductIDStart: ['-1'],
      ProductIDEnd: ['-1'],
      CategoryIDStart: ['-1'],
      CategoryIDEnd: ['-1'],
      SubCategoryIDStart: ['-1'],
      SubCategoryIDEnd: ['-1'],
      BinIDStart: ['-1'],
      BinIDEnd: ['-1'],
      StockTakeStatus: ['']
    });
  }
  get f() { return this.InventoryStockTakeForm.controls; }
  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr)
    let index = Permissions.findIndex(c => c.menuID == "212");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.InventoryStockTakeForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.InventoryStockTakeForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.InventoryStockTakeForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }
  SetStockCreatePermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr)
    let index = Permissions.findIndex(c => c.menuID == "213");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.stock_create_read_Access = ModulePermissions.read_Access;
      this.stock_create_write_Access = ModulePermissions.write_Access;
      this.stock_create_delete_Access = ModulePermissions.delete_Access;
      this.stock_create_all_Access = ModulePermissions.all_Access;
      this.isStockCreater = true;

      if (!this.stock_create_all_Access) {
        if (!this.stock_create_write_Access) {
          this.isStockCreater = false;
        }
      } else {
        this.stock_create_read_Access = true;
        this.stock_create_write_Access = true;
        this.stock_create_delete_Access = true;
        this.stock_create_all_Access = true;
      }
    }
    else {
      this.isStockCreater = false;
      this.stock_create_read_Access = false;
      this.stock_create_write_Access = false;
      this.stock_create_delete_Access = false;
      this.stock_create_all_Access = false;
    }
  }

  SetStockApprovePermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr)
    let index = Permissions.findIndex(c => c.menuID == "214");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.stock_approve_read_Access = ModulePermissions.read_Access;
      this.stock_approve_write_Access = ModulePermissions.write_Access;
      this.stock_approve_delete_Access = ModulePermissions.delete_Access;
      this.stock_approve_all_Access = ModulePermissions.all_Access;
      this.isStockApprover = true;

      if (!this.stock_approve_all_Access) {
        if (!this.stock_approve_write_Access) {
          this.isStockApprover = false;
        }
      } else {
        this.stock_approve_read_Access = true;
        this.stock_approve_write_Access = true;
        this.stock_approve_delete_Access = true;
        this.stock_approve_all_Access = true;
      }
    }
    else {
      this.isStockApprover = false;
      this.stock_approve_read_Access = false;
      this.stock_approve_write_Access = false;
      this.stock_approve_delete_Access = false;
      this.stock_approve_all_Access = false;
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
  /* FOR Aggird End  */

  //add for internal-transfer 
  AddNew(): void {
    this.InventoryStockTakeForm.get('WareHouseID').enable();
    this.InventoryStockTakeForm.enable();
    this.Mode = 'Add';
    this.StockTakeStatus = '0';
    // this.InventoryStockTakeForm.patchValue({
    //   StockTakeNo: '',
    
    // });
    //this.InventoryStockTakeForm.get('StockTakeNo').setValue=""
  }
  //Cancel the Add/Edit
  Cancel(): void {
    
    //this.router.navigate(['/inv/inventorystocktake']);

    this.InventoryStockTakeForm.get('WareHouseID').enable();
    this.SubCategoryEndList = [];
    this.SubCategoryStartList = [];
    // this.CategoryStartList = [];
    // this.CategoryEndList = [];

    this.Mode = 'List';
    this.submitted = false;
    this.Mode = "List";
    this.InventoryStockTakeForm.patchValue({
      CycleID: '',
      ProductIDStart: '',
      ProductIDEnd: '',
      CategoryIDStart: '',
      CategoryIDEnd: '',
      SubCategoryIDStart: '',
      SubCategoryIDEnd: '',
      BinIDStart: '',
      BinIDEnd: '',
      StockTakeStatus: '',
      WareHouseID: '-1'
    });
    //this.BindDetails(InventoryStock);
  }
  BindCategory() {
    this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_INV_Categories).subscribe((resp: any) => {
      this.CategoryStartList = resp.data.tabledata;
      this.CategoryEndList = resp.data.tabledata;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  GetCycle() {
    this.invCommonService.getInvCycle().subscribe((resp: any) => {
      this.CycleList = resp.data.cycle;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindCycle() {
    this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_INV_StockTakeCycle).subscribe((resp: any) => {
      console.log(resp);
      this.Cycle_list = resp.data.tabledata;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindInventories() {
    this.sysCommonService.getFinishedProducts().subscribe((resp: any) => {
      this.BindInventory = resp.data.productkits;
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To bind the data of all warehouse to the Grid.
  BindWareHouse() {
    this.Loading = true;
    this.invCommonService.getWareHouseByRole().subscribe((resp: any) => {
      this.WareHouse = resp.data.warehouse;
      // this.WareHouse = resp.data.warehouse;
      this.Loading = false;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To bind the data of all WareHouse Bin   to the Grid
  /*  BindWareHouseBins() {
     this.Loading = true;
     this.invCommonService.getWareHouseBins().subscribe((resp: any) => {
       this.BindWareHouseBin = resp.data.wareHouseBins;
       this.Loading = false;
 
     }, (error) => {
       console.error('Problem with the sevice. Please try later : ' + error);
     });
   } */
  /*  BindWareHouseBins() { 
     debugger;
     this.invCommonService.getWareHouseBinByWareHouseID(this.SelecteWareHouseID).subscribe((resp: any) => {
       this.BindWareHouseBin = resp.data.warehousebin;  
     }, (error) => {
       console.error('Problem with the sevice. Please try later : ' + error);
     });
   } */
  onWareHouseChange(ID) {
    this.BindWareHouseBin = [];
    if (ID != "-1") {
      this.invCommonService.getWareHouseBinByWareHouseID(ID).subscribe((resp: any) => {
        this.BindWareHouseBin = resp.data.warehousebin;
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
  }
  onCategoryStartChange(ID) {
    this.SubCategoryStartList = [];
    if (ID && ID != "-1") {
      this.sysCommonService.getChildLookup(GenricTableIDByName.LBS_INV_Categories, ID).subscribe((resp: any) => {
        this.SubCategoryStartList = resp.data.tabledata;
      }, (error) => {
        this.Loading = false;
        this.toastr.error(error);
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
  }
  onCategoryEndChange(ID) {
    this.SubCategoryEndList = [];
    if (ID && ID != "-1") {
      this.sysCommonService.getChildLookup(GenricTableIDByName.LBS_INV_Categories, ID).subscribe((resp: any) => {
        this.SubCategoryEndList = resp.data.tabledata;
      }, (error) => {
        this.Loading = false;
        this.toastr.error(error);
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
  }
  //To bind the data of all price-group to the Grid.
  BindInventoryStockTake() {
    this.Loading = true;
    this.AgLoad = false;
    this.stocktake.getInventoryStockTake().subscribe((resp: any) => {
      this.Inventorystocktake = resp.data.inventorystocktake;
      this.RowData = resp.data.inventorystocktake;
      if (this.inventorystocktakeroute) {
        debugger;
        let data = this.RowData.filter(r => r.stockTakeNo == this.inventorystocktakeroute);
        console.log(data);
        this.SelectedStockTakeID = data[0].id;
        this.SelectedStockTakeNo = data[0].stockTakeNo;
        this.SelectedWareHouseID = data[0].wareHouseID;
        this.StockTakeStatus = data[0].stockTakeStatus;
      //  this.Mode = "Edit";
        this.OnActionClick(data[0]);
        //this.Mode = "Edit";
      }
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {

      this.Loading = false;
      //  this.toastr.error(error);
      // console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  OnCancel() {
    this.Cancel();
    this.Mode = 'List';
  }
  //onSave() {
  //  this.confirmation.ConfirmationPopup('Are you sure to save record?');
  //}
  //To save the price-group details to database table by calling the API service
  onSave() {

    debugger;
    this.submitted = true;
    if (this.InventoryStockTakeForm.invalid) {
      return;
    }
    this.Loading = true;
    let stock = new LBSINVInventoryStockTake();
    stock.CompanyID = this.CompanyID;
    stock.CreatedBY = localStorage.getItem('LoginID');
    stock.StockTakeNo = this.InventoryStockTakeForm.get('StockTakeNo').value;
    stock.WareHouseID = this.InventoryStockTakeForm.get('WareHouseID').value;
    stock.CycleID = this.InventoryStockTakeForm.get('CycleID').value;
    stock.ProductIDStart = this.InventoryStockTakeForm.get('ProductIDStart').value;
    stock.ProductIDEnd = this.InventoryStockTakeForm.get('ProductIDEnd').value;
    stock.CategoryIDStart = this.InventoryStockTakeForm.get('CategoryIDStart').value;
    stock.CategoryIDEnd = this.InventoryStockTakeForm.get('CategoryIDEnd').value;
    stock.SubCategoryIDStart = this.InventoryStockTakeForm.get('SubCategoryIDStart').value;
    stock.SubCategoryIDEnd = this.InventoryStockTakeForm.get('SubCategoryIDEnd').value;
    stock.BinIDStart = this.InventoryStockTakeForm.get('BinIDStart').value;
    stock.BinIDEnd = this.InventoryStockTakeForm.get('BinIDEnd').value;
    stock.CreatedBY = localStorage.getItem('LoginID');
    stock.StockTakeStatus = this.InventoryStockTakeForm.get('StockTakeStatus').value;
    //If the mode Add will insert data to DB table else update the row by ID
    if (this.Mode == 'Add') {
      this.stocktake.addInventoryStockTake(stock).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.IsActive = true;
          this.toastr.success('Inventory Stock Take added successfully');
          // alert(resp.message);
          //   this.ResetForm();
          this.BindInventoryStockTakeSave(resp.data.id);
          this.InventoryStockTakeForm.disable();
          this.Loading = false;
        }
        else {
          this.toastr.error(resp.message);
        }
      }, (error) => {
        //  console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    else if (this.Mode == 'Edit') {
      this.SelectedStockTakeID = this.InventoryStockTakeForm.get('ID').value;
      stock.ID = this.InventoryStockTakeForm.get('ID').value;
      this.stocktake.updateInventoryStockTake(stock).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('Inventory Stock Take  updated successfully');
          //  alert(resp.message);
          // this.ResetForm();
          this.BindInventoryStockTakeSave(this.InventoryStockTakeForm.get('ID').value);
          // this.Mode = 'List';
        }
        else {
          this.toastr.error(resp.message);
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
  }
  BindInventoryStockTakeSave(id) {
    debugger;
    this.Loading = true;
    this.AgLoad = false;
    this.stocktake.getInventoryStockTake().subscribe((resp: any) => {
      this.Inventorystocktake = resp.data.inventorystocktake;
      debugger;
      this.RowData = resp.data.inventorystocktake;
      let index = this.RowData.findIndex(c => c.id == id.toLowerCase());
      if (index >= 0) {

        this.StockTakeStatus = this.RowData[index].stockTakeStatus;
        this.BindDetails(this.RowData[index]);
        this.onCategoryStartChange(this.RowData[index].categoryIDStart)
        this.onCategoryEndChange(this.RowData[index].categoryIDEnd)
        this.IsDetail = true;
        this.Mode = 'Edit';
      }
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {

      this.Loading = false;

    });
  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = '';
    if (this.inventorystocktakeroute) {
      colId = 'Edit';
    }
    else {
      colId = event.column.getId();
    }
    if (colId == 'Edit') {
      if (this.inventorystocktakeroute) {
        if (event.deleteStatus == 'Active') {
          this.IsActive = true;
        } else {
          this.IsActive = false;
        }
      }
      else if (event.data.deleteStatus == 'Active') {
        this.IsActive = true;
      } else {
        this.IsActive = false;
      }
     // this.Mode = 'Edit';

      /* if (event.data.stockTakeStatus != 'New') {
        this.InventoryStockTakeForm.disable();
      } else {
        this.InventoryStockTakeForm.enable();
        this.InventoryStockTakeForm.get('WareHouseID').disable();
      }  */
      this.InventoryStockTakeForm.disable();
      if (this.inventorystocktakeroute){  
        this.BindDetails(event);
        this.Mode = "Edit";
      }
      else {
        this.BindDetails(event.data);
        this.onCategoryStartChange(event.data.categoryIDStart)
        this.onCategoryEndChange(event.data.categoryIDEnd)
        this.Mode = "Edit";
      }
    } else if (colId == 'Delete') {
      this.OnDelete(event.data.id)
    }
    
  }
  BindDetails(event) {
    debugger;
    //this.SelectedStockTakeNo = event.stockTakeNo;
    this.SelectedStockTakeNo = event.stockTakeNo;
    this.SelectedStockTakeID = event.id;
    this.SelectedWareHouseID = event.wareHouseID;
    this.StockTakeStatus = event.stockTakeStatus;
    this.InventoryStockTakeForm.patchValue({
      ID: event.id,
      CompanyID: event.companyID,
      StockTakeNo: event.stockTakeNo,
      WareHouseID: event.wareHouseID,
      CycleID: event.cycleID,
      ProductIDStart: event.productIDStart,
      ProductIDEnd: event.productIDEnd,
      CategoryIDStart: event.categoryIDStart,
      CategoryIDEnd: event.categoryIDEnd,
      SubCategoryIDStart: event.subCategoryIDStart,
      SubCategoryIDEnd: event.subCategoryIDEnd,
      BinIDStart: event.binIDStart,
      BinIDEnd: event.binIDEnd,
      StockTakeStatus: event.stockTakeStatus
    });
  }

  OnDelete(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_INV_InventoryStockTake', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      // this.toastr.success('Currency  details deleted successfully');
      this.BindInventoryStockTake();
      //  this.ResetForm();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  UpdateStockTakeStatus(StockTakeStatus) {
    let stock = new LBSINVInventoryStockTake();
    stock.CompanyID = this.CompanyID;
    stock.CreatedBY = localStorage.getItem('LoginID');
    stock.StockTakeNo = this.InventoryStockTakeForm.get('StockTakeNo').value;
    stock.WareHouseID = this.InventoryStockTakeForm.get('WareHouseID').value;
    stock.CycleID = this.InventoryStockTakeForm.get('CycleID').value;
    stock.ProductIDStart = this.InventoryStockTakeForm.get('ProductIDStart').value;
    stock.ProductIDEnd = this.InventoryStockTakeForm.get('ProductIDEnd').value;
    stock.CategoryIDStart = this.InventoryStockTakeForm.get('CategoryIDStart').value;
    stock.CategoryIDEnd = this.InventoryStockTakeForm.get('CategoryIDEnd').value;
    stock.SubCategoryIDStart = this.InventoryStockTakeForm.get('SubCategoryIDStart').value;
    stock.SubCategoryIDEnd = this.InventoryStockTakeForm.get('SubCategoryIDEnd').value;
    stock.BinIDStart = this.InventoryStockTakeForm.get('BinIDStart').value;
    stock.BinIDEnd = this.InventoryStockTakeForm.get('BinIDEnd').value;
    stock.StockTakeStatus = StockTakeStatus;

    stock.ID = this.InventoryStockTakeForm.get('ID').value;
    this.stocktake.updateInventoryStockTake(stock).subscribe((resp: any) => {
      /* if (resp.isSuccess) {
        this.toastr.success('Inventory Stock Take updated successfully');
        //  alert(resp.message);
        // this.ResetForm();
        this.StockTakeStatus=StockTakeStatus;
        this.BindInventoryStockTake();
        //this.Mode = 'List';
      }
      else {
        this.toastr.error(resp.message);
      } */
      if (!resp.isSuccess) {
        this.toastr.warning(resp.message);
      } else {
        this.toastr.success('Inventory Stock Take updated successfully');

        this.BindInventoryStockTakeSave(this.InventoryStockTakeForm.get('ID').value);
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
  // TestProduct() {
  //   //alert(id);
  // }
  // SelectTestProduct: any;
  // onChange(SelectTestProduct) {
  //   alert(SelectTestProduct);
  // }
  //Test() {
  //  alert(this.InventoryStockTakeForm.get('ProductTest').value);
  //}
}

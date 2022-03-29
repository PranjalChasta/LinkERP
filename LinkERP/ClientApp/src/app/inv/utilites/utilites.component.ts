import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InventoryService } from '../services/inventory.service';
import { FieldTypeEnum } from 'src/app/models/pos/fieldtypeEnum';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { LookUpListEnum } from 'src/app/models/pos/lookupListEnum';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { GenricTableIDByName } from 'src/app/shared/enums/enum-generictables';
import { ToastrService } from 'ngx-toastr';
import { InvCommonService } from '../services/inv-common.service';
import { InventoryPriceUpdate } from 'src/app/models/inv/inventory-price-update';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { CustomValidators } from 'ngx-custom-validators';
@Component({
  selector: 'app-utilites',
  templateUrl: './utilites.component.html',
  styleUrls: ['./utilites.component.css']
})
export class UtilitesComponent implements OnInit {
  UtilitesForm: FormGroup;
  ColumnDefs;
  RowData: any;
  Mode: any = 'List';
  submitted: boolean;
  //WareHouseID: any;
  utilities: any[] = [];//Array variable of warehouse data to bind grid
  addreadonly: boolean;
  //Ag-grid 
  AgLoad: boolean = false
  Loading: boolean;
  IsActive: boolean;
  read_Access: any;
  private fieldTypeEnum = FieldTypeEnum;
  public fieldTypeEnumOption = [];
  private lookupListEnum = LookUpListEnum;
  public lookupListEnumOption = [];
  write_Access: any;
  delete_Access: any;
  all_Access: any;
  CategoryList: any;
  SubCategoryList: any;
  BindInventory: any;
  WareHouseFrom: any;
  WareHouse: any;
  WareHouseTo: any;
  CategoryStartList: any;
  CategoryEndList: any;
  SubCategoryStartList: any[] = [];
  SubCategoryEndList: any[] = [];
  SelectedUtilityID: any;
  CompanyId = localStorage.getItem('CompanyID');
  AccessTab: string;
  constructor(private UtilitesFB: FormBuilder, private inventoryService: InventoryService,
    private cryptoAes: CryptoAes, private sysCommonService: SysCommonService,
    private toastr: ToastrService, private commonService: InvCommonService,
    private deleteRecordsService: DeleteRecordsService,) { }

  ngOnInit() {
    this.getprice();
    this.SetPermissions();
    this.BindCategory();
    this.BindInventories();
    this.BindWareHouse();
    this.AgLoad = false;
    this.Mode = "List";
    this.submitted = false;
    this.AccessTab = "WareHouse";
    this.CreateForm();
    this.ColumnDefs = [
      { headerName: 'PriceUpdateSchedulerNumber', field: 'priceUpdateSchedulerNumber', sortable: true, filter: true, checkboxSelection: false },
      // { headerName: 'ProductIDFrom', field: 'productIDFrom', sortable: true, filter: true },
      { headerName: 'ProductIDFrom', field: 'productName', sortable: true, filter: true },
      // { headerName: 'CategoryIDFrom', field: 'categoryIDTo', sortable: true, filter: true },
      { headerName: 'CategoryIDFrom', field: 'categoryName', sortable: true, filter: true },
      // { headerName: 'SubCategoryIDFrom', field: 'subCategoryIDFrom', sortable: true, filter: true },
      { headerName: 'SubCategoryIDFrom', field: 'subCategory', sortable: true, filter: true },
      { headerName: 'WareHouse From', field: 'wareHouseFromName', sortable: true, filter: true },
      { headerName: 'WareHouse To', field: 'wareHouseToName', sortable: true, filter: true },
      // { headerName: 'SupplierIDFrom', field: 'warehouseTransactionMask', sortable: true, filter: true },
      { headerName: 'SupplierIDFrom', field: 'subCategory', sortable: true, filter: true },
      { headerName: 'SubCategoryIDFrom', field: 'subCategory', sortable: true, filter: true },
      // { headerName: 'PriceFromWareHouse', field: 'priceFromWareHouse', sortable: true, filter: true },
      { headerName: 'PriceFromWareHouse', field: 'priceFromWareHouseName', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: false }
    ];
  }
  CreateForm() {
    this.UtilitesForm = this.UtilitesFB.group({
      ID: [''],
      CompanyID: [''],
      PriceUpdateSchedulerNumber: ['', Validators.required],
      CategoryIDStart: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')],
      CategoryIDEnd: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')],
      ProductIDStart: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')],
      ProductIDEnd: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')],
      SubCategoryIDStart: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')],
      SubCategoryIDEnd: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')],
      WareHouseFrom: ['00000000-0000-0000-0000-000000000000'],
      WareHouseTo: ['00000000-0000-0000-0000-000000000000'],
      PricetoChange: [''],
      Amount: [0],
      PercentValue: [false],
      PriceChangeLevel: [false],
      IncreaseDecrease: [false],
      UseExistingWareHousePrice: [false],
      PriceFromWareHouse: ['00000000-0000-0000-0000-000000000000'],
      SupplierIDTo: ['00000000-0000-0000-0000-000000000000'],
      SupplierIDFrom: ['00000000-0000-0000-0000-000000000000']
    })
  }
  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "405");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      // this.UtilitesForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.UtilitesForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.UtilitesForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
  }
  getprice() {
    debugger;
    this.inventoryService.getInventoryPriceUpdate().subscribe((resp: any) => {
      console.log(resp.data.utility)
      this.utilities = resp.data.utility;
      this.RowData = resp.data.utility;
      this.AgLoad = true;
      this.Loading = false;
      console.log(this.RowData)
      this.Mode = 'List';
    })
  }
  AddNew(): void {
    this.Mode = 'Add';
    //this.addreadonly = false;
    this.IsActive = true;
    this.submitted = false;
    this.CreateForm();

  }
  Edit(ID): void {
    debugger;
    this.Mode = 'Edit';
    this.SelectedUtilityID = ID;
    this.BindWareUtilityID(ID);
    this.UtilitesForm.enable();

    //this.addreadonly = true;
  }
  OnActionClick(event: any) {
    debugger;
    var colId = event.column.getId();
    if (colId == 'Edit') {

      this.Edit(event.data.id);
      this.SelectedUtilityID = event.data.id;
      this.onCategoryStartChange(event.data.categoryIDFrom);
      this.onCategoryEndChange(event.data.categoryIDTo);
    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.id)
    }
  }
  // BindCategory() {
  //   this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_INV_Categories).subscribe((resp: any) => {
  //     console.log(resp);
  //     this.CategoryList = resp.data.tabledata;
  //   }, (error) => {
  //     this.Loading = false;
  //     this.toastr.error(error);
  //     console.error('Problem with the sevice. Please try later : ' + error);
  //   });
  // }

  onCategoryChange(ID) {
    this.SubCategoryList = [];
    if (ID != "00000000-0000-0000-0000-000000000000") {
      this.sysCommonService.getChildLookup(GenricTableIDByName.LBS_INV_Categories, ID).subscribe((resp: any) => {
        console.log(resp);
        this.SubCategoryList = resp.data.tabledata;
      }, (error) => {
        this.Loading = false;
        this.toastr.error(error);
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
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
  Cancel(): void {
    debugger;
    this.ResetForm();
    this.getprice();

  }
  ResetForm() {
    this.UtilitesForm.patchValue({
      ID: '',
      CompanyID: '',
      PriceUpdateSchedulerNumber: '',
      CategoryIDStart: '',
      CategoryIDEnd: '',
      ProductIDStart: '',
      ProductIDEnd: '',
      SubCategoryIDStart: '',
      SubCategoryIDEnd: '',
      WareHouseFrom: '',
      WareHouseTo: '',
      PricetoChange: '',
      Amount: '',
      PercentValue: '',
      PriceChangeLevel: '',
      IncreaseDecrease: '',
      UseExistingWareHousePrice: '',
      PriceFromWareHouse: '',
    });
    this.UtilitesForm.markAsTouched();
    this.UtilitesForm.markAsPristine();
    this.submitted = false;
  }
  BindWareHouse() {
    // this.Loading = true; 
    this.commonService.getWareHouse().subscribe((resp: any) => {
      this.WareHouseFrom = resp.data.warehouse;
      this.WareHouse = resp.data.warehouse;
      this.WareHouseTo = resp.data.warehouse;
      // this.Loading = false;
    }, (error) => {

      // this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onWarehouseFromChange(event) {
    this.WareHouseTo = this.WareHouse;
    this.WareHouseTo = this.WareHouseTo.filter(x => x.id !== event.target.value)
  }
  onWarehouseToChange(event) {
    this.WareHouseFrom = this.WareHouse;
    this.WareHouseFrom = this.WareHouseFrom.filter(x => x.id !== event.target.value)
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
  onCategoryStartChange(ID) {
    this.SubCategoryStartList = [];
    if (ID && ID != "00000000-0000-0000-0000-000000000000") {
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
    if (ID && ID != "00000000-0000-0000-0000-000000000000") {
      this.sysCommonService.getChildLookup(GenricTableIDByName.LBS_INV_Categories, ID).subscribe((resp: any) => {
        this.SubCategoryEndList = resp.data.tabledata;
      }, (error) => {
        this.Loading = false;
        this.toastr.error(error);
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
  }
  get f() { return this.UtilitesForm.controls; }
  onSave(Action) {
    debugger;
    this.submitted = true;
    if (this.UtilitesForm.invalid) {
      return;
    }
    debugger;
    let inventoryPriceUpdate: any = new InventoryPriceUpdate();
    inventoryPriceUpdate.CompanyID = this.CompanyId;
    inventoryPriceUpdate.PriceUpdateSchedulerNumber = this.UtilitesForm.get('PriceUpdateSchedulerNumber').value;
    inventoryPriceUpdate.ProductIDFrom = this.UtilitesForm.get('ProductIDStart').value;
    inventoryPriceUpdate.ProductIDTo = this.UtilitesForm.get('ProductIDEnd').value;
    inventoryPriceUpdate.CategoryIDFrom = this.UtilitesForm.get('CategoryIDStart').value;
    inventoryPriceUpdate.CategoryIDTo = this.UtilitesForm.get('CategoryIDEnd').value;
    inventoryPriceUpdate.SubCategoryIDFrom = this.UtilitesForm.get('SubCategoryIDStart').value;
    inventoryPriceUpdate.SubCategoryIDTo = this.UtilitesForm.get('SubCategoryIDEnd').value;
    inventoryPriceUpdate.WareHouseIDFrom = this.UtilitesForm.get('WareHouseFrom').value == '00000000-0000-0000-0000-000000000000' ? null : this.UtilitesForm.get('WareHouseFrom').value;
    inventoryPriceUpdate.WareHouseIDTo = this.UtilitesForm.get('WareHouseTo').value == '00000000-0000-0000-0000-000000000000' ? null : this.UtilitesForm.get('WareHouseTo').value;
    inventoryPriceUpdate.PricetoChange = this.UtilitesForm.get('PricetoChange').value;
    inventoryPriceUpdate.Amount = this.UtilitesForm.get('Amount').value;
    inventoryPriceUpdate.SupplierIDFrom = this.UtilitesForm.get('SupplierIDFrom').value;
    inventoryPriceUpdate.SupplierIDTo = this.UtilitesForm.get('SupplierIDTo').value;
    inventoryPriceUpdate.PriceChangeLevel = this.UtilitesForm.get('PriceChangeLevel').value;
    inventoryPriceUpdate.UseExistingWareHousePrice = this.UtilitesForm.get('UseExistingWareHousePrice').value;
    inventoryPriceUpdate.IncreaseDecrease = this.UtilitesForm.get('IncreaseDecrease').value;
    inventoryPriceUpdate.PercentValue = this.UtilitesForm.get('PercentValue').value;
    inventoryPriceUpdate.PriceFromWareHouse = this.UtilitesForm.get('PriceFromWareHouse').value == '00000000-0000-0000-0000-000000000000' ? null : this.UtilitesForm.get('PriceFromWareHouse').value;
    if (this.Mode == 'Add') {
      debugger;
      this.inventoryService.addInventoryPriceUpdate(inventoryPriceUpdate).subscribe((resp: any) => {
        debugger;
        if (resp.isSuccess) {
          this.toastr.success('Inventory PriceUpdate  added successfully');
          if (Action == 'Close') {
            // this.Cancel();
            // this.BindPurchaseInvoices();
            this.getprice();


          }
          else {
            this.BindWareUtilityID(resp.data.id);
            this.Mode = 'Edit';
            this.Loading = false;
          }

        }

      });
    }

    else if (this.Mode == 'Edit') {
      // purchaseinvoice.ID = this.PurchaseInvoiceForm.get('ID').value;
      inventoryPriceUpdate.ID = this.UtilitesForm.get('ID').value;
      this.inventoryService.updateInventoryPriceUpdate(inventoryPriceUpdate).subscribe((resp: any) => {
        this.toastr.success('Inventory PriceUpdate  details Updated successfully')
        if (Action == 'Close') {
          // this.Cancel();
          // this.BindPurchaseInvoices();
          this.getprice();


        }
        else {
          this.BindWareUtilityID(resp.data.id);
          this.Mode = 'Edit';
          this.Loading = false;
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }

  }

  BindWareUtilityID(ID) {
    debugger;
    this.inventoryService.InventoryPriceUpdateByID(ID).subscribe((resp: any) => {
      debugger;
      console.log(resp);
      if (resp.isSuccess == true) {
        let inventoryPriceUpdate: any = new InventoryPriceUpdate();
        inventoryPriceUpdate = resp.data.bank;
        console.log(inventoryPriceUpdate);
        this.UtilitesForm.patchValue({
          ID: inventoryPriceUpdate.id,
          CompanyID: inventoryPriceUpdate.companyID,
          PriceUpdateSchedulerNumber: inventoryPriceUpdate.priceUpdateSchedulerNumber,
          ProductIDStart: inventoryPriceUpdate.productIDFrom,
          ProductIDEnd: inventoryPriceUpdate.productIDTo,
          CategoryIDStart: inventoryPriceUpdate.categoryIDFrom,
          CategoryIDEnd: inventoryPriceUpdate.categoryIDTo,
          SubCategoryIDStart: inventoryPriceUpdate.subCategoryIDFrom,
          SubCategoryIDEnd: inventoryPriceUpdate.subCategoryIDFrom,
          WareHouseFrom: inventoryPriceUpdate.wareHouseIDFrom,
          WareHouseTo: inventoryPriceUpdate.wareHouseIDTo,
          PricetoChange: inventoryPriceUpdate.pricetoChange,
          Amount: inventoryPriceUpdate.amount,
          PercentValue: inventoryPriceUpdate.percentValue,
          PriceChangeLevel: inventoryPriceUpdate.priceChangeLevel,
          IncreaseDecrease: inventoryPriceUpdate.increaseDecrease,
          UseExistingWareHousePrice: inventoryPriceUpdate.useExistingWareHousePrice,
          PriceFromWareHouse: inventoryPriceUpdate.priceFromWareHouse
        })
        if (!inventoryPriceUpdate.deleted) {
          this.UtilitesForm.enable();
          this.IsActive = true;
        } else {
          this.UtilitesForm.disable();
          this.IsActive = false;
        }
      }
    },
      (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
  }
  onDeleteChecked(ID) {
    debugger;
    this.Loading = true;
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_INV_InventoryPriceUpdate', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.Mode = 'List';
      this.getprice();
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  OnProductChange(ID) {
    debugger;
    if (ID != "-1") {
      let index = this.BindInventory.findIndex(c => c.id == ID);
      if (index >= 0) {
        this.UtilitesForm.patchValue({
          ProductDescription: this.BindInventory[index].productName
        })
      }
    } else {
      this.UtilitesForm.patchValue({
        ProductDescription: null
      })
    }
  }
}


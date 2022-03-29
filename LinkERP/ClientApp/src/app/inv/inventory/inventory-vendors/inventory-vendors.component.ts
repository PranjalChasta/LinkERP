import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { GenricTableIDByName } from 'src/app/shared/enums/enum-generictables';
import { LBSINVInventoryVendor } from 'src/app/models/inv/lbs-inv-inventory-vendor';
import { InventoryVendorService } from '../../services/inventory-vendor.service';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ngx-custom-validators';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { InvCommonService } from '../../services/inv-common.service';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { SharedFormatterService } from 'src/app/shared/services/shared-formatter.service';
@Component({
  selector: 'app-inventory-vendors',
  templateUrl: './inventory-vendors.component.html',
  styleUrls: ['./inventory-vendors.component.css']
})
export class InventoryVendorsComponent implements OnInit {
  @Input() InventryID: any;
  CompanyId = localStorage.getItem('CompanyID');
  Mode: any = 'List';
  date = new Date();
  ColumnDefs;
  vendormeasure: any;
  RowData: any;
  AgLoad: boolean = false
  InventoryVendorForm: FormGroup;
  inventoryVendors: any;
  UOMList: any;
  submitted: boolean;
  read: boolean;
  Loading: any = false;
  AccessTab: string;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  Vendor: any;
  IsActive: boolean;
  @Input() IsInventoryActive: boolean;
  PageSize: any;
  Currentpage: string;
  constructor(
    private FB: FormBuilder,
    private commonService: InvCommonService,
    private sysCommonService: SysCommonService,
    private cryptoAes: CryptoAes,
    private inventoryVendor: InventoryVendorService,
    private toastr: ToastrService,
    private sharedFormatterService: SharedFormatterService
  ) { }
  ngOnInit() {
    this.AgLoad = false;
    this.Mode = "List";
    this.CreateForm();
    this.SetPermissions();
    this.AgGridColumns();
    this.PageSize = "50";
    this.BindInventoryVendor();
    this.BindUOM();
    this.BindVendor();
    this.Currentpage = "0";
    if (this.Mode == 'Edit') {
      alert('Edit');
      this.InventoryVendorForm.get('LastPurchasedUnitPrice').disable();
      this.InventoryVendorForm.get('LastPurchasedDate').disable();
    }

  }
  AgGridColumns() {
    this.ColumnDefs = [

      { headerName: 'Vendor Name', field: 'vendorAccountName', sortable: true, filter: true },
      { headerName: 'Vendor SKU', field: 'vendorSKU', sortable: true, filter: true },
      { headerName: 'Vendor BarCode', field: 'vendorBarCode', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Default', field: 'defaultStatus', sortable: true, filter: true },
      { headerName: 'Purchase UOM', field: 'purchaseUOMName', sortable: true, filter: true },
      { headerName: 'Purchased Date', field: 'lastPurchasedDate', sortable: true, filter: true, valueFormatter: this.sharedFormatterService.dateTimeFormatter },
      { headerName: 'Purchased Unit Price', field: 'lastPurchasedUnitPrice_text', sortable: true, filter: true, cellStyle: { textAlign: 'left' }, },
      // { headerName: 'Vendor WareHouse', field: 'vendorWareHouse', sortable: true, filter: true },
      /* { headerName: 'Purchased Unit Price', field: 'lastPurchasedUnitPrice', sortable: true, filter: true }, */
      // { headerName: 'Date Created', field: 'dateCreated', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access || !this.IsInventoryActive }
    ];
  }
  CreateForm() {
    //let date = new Date();
    this.InventoryVendorForm = this.FB.group({
      ID: [''],
      Vendor: ['-1', CustomValidators.notEqual('-1')],
      VendorWareHouse: ['-1'],
      PurchaseUOM: ['-1', CustomValidators.notEqual('-1')],
      VendorSKU: [''],
      VendorBarCode: [''],
      Default: ['true'],
      LastPurchasedDate: [null],
      DateCreated: [''],
      LastPurchasedUnitPrice: [''],
    })
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
      this.InventoryVendorForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.InventoryVendorForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.InventoryVendorForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }
  get f() { return this.InventoryVendorForm.controls; }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  //Cancel the Add/Edit
  Cancel() {
    //this.ResetForm();
    this.BindInventoryVendor();
    this.Mode = 'List';
    //   let InventoryVendor = {
    //     Vendor: ['-1'],
    //     PurchaseUOM: ['-1'],
    //   };
    //  // this.BindDetails(InventoryVendor);
  }
  ResetForm() {
    this.InventoryVendorForm.patchValue({
      ID: '',
      Vendor: '-1',
      VendorWareHouse: '-1',
      PurchaseUOM: '-1',
      VendorSKU: '',
      VendorBarCode: '',
      Default: 'true',
      LastPurchasedDate: null,
      LastPurchasedUnitPrice: '',
    });
    this.InventoryVendorForm.markAsUntouched();
    this.InventoryVendorForm.markAsPristine();
    this.submitted = false;
  }

  //Add new Vendor
  AddNew(): void {
    this.ResetForm();
    this.Mode = 'Add';
    this.IsActive = true;
    this.InventoryVendorForm.enable();
    this.InventoryVendorForm.get('LastPurchasedUnitPrice').disable();
    this.InventoryVendorForm.get('LastPurchasedDate').disable();
  }

  OnActionClick(event: any) {
    debugger;
    var colId = event.column.getId();
    if (colId == 'Edit') {
      // this.read = false;
      this.Mode = 'Edit';
      this.BindDetails(event.data);
      this.InventoryVendorForm.get('LastPurchasedUnitPrice').disable();
      this.InventoryVendorForm.get('LastPurchasedDate').disable();
    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.id)
    }
  }
  //To bind the data of UOM to controls.
  BindUOM() {
    this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_INV_UnitOfMeasure).subscribe((resp: any) => {
      this.UOMList = resp.data.tabledata;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //To bind the data of InventoryVendor to controls.
  BindInventoryVendor() {
    //this.Loading = true;
    debugger;
    this.AgLoad = false;
    this.sysCommonService.getInventoryVendor(this.InventryID).subscribe((resp: any) => {

      this.inventoryVendors = resp.data.inventoryVendor;
      this.RowData = resp.data.inventoryVendor;
      this.AgLoad = true;
      //  this.Loading = false;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //To bind the vendor names to the dropdown
  BindVendor() {
    this.commonService.getVendor().subscribe((resp: any) => {
      this.Vendor = resp.data.vendors;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  Edit(ID) {
    this.Mode = 'Edit';
    this.BindVendordetails(ID);
  }
  BindVendordetails(ID) {
    debugger;
    this.vendormeasure = this.InventryID;
    this.inventoryVendor.getInventoryVendorByID(ID).subscribe((resp: any) => {
      console.log(resp);
      if (resp.isSuccess == true) {
        let event: any = new LBSINVInventoryVendor();
        event = resp.data.inventoryPriceLevel;
        this.InventoryVendorForm.patchValue({
          ID: event.id,
          Default: event.default,
          LastPurchasedDate: event.lastPurchasedDate,
          LastPurchasedUnitPrice: event.lastPurchasedUnitPrice_text,
          PurchaseUOM: event.purchaseUOM,
          VendorBarCode: event.vendorBarCode,
          Vendor: event.vendorID,
          //  Vendor: event.vendorAccountName,
          VendorSKU: event.vendorSKU,
        });
        if (!event.deleted) {
          this.InventoryVendorForm.enable();
          this.IsActive = true;
        } else {
          this.InventoryVendorForm.disable();
          this.IsActive = false;
        }
      }

    },
      (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
  }
  //To bind the data of Vendor to controls for edit/update.
  BindDetails(event) {
    debugger;
    console.log(event);
    this.vendormeasure = this.InventryID;
    this.InventoryVendorForm.patchValue({
      ID: event.id,
      // DateCreated: event.dateCreated,
      Default: event.default,
      LastPurchasedDate: event.lastPurchasedDate,
      LastPurchasedUnitPrice: event.lastPurchasedUnitPrice_text,
      PurchaseUOM: event.purchaseUOM,
      VendorBarCode: event.vendorBarCode,
      Vendor: event.vendorID,
      VendorAccountName: event.vendorAccountName,
      VendorSKU: event.vendorSKU,
    });

    if (!event.deleted) {
      this.InventoryVendorForm.enable();
      this.IsActive = true;
    } else {
      this.InventoryVendorForm.disable();
      this.IsActive = false;
    }

    if (!this.IsInventoryActive) {
      this.InventoryVendorForm.disable();
      this.InventoryVendorForm.get('LastPurchasedUnitPrice').disable();
      this.InventoryVendorForm.get('LastPurchasedDate').disable();
    }
  }

  OnCancel() {
    //  this.Cancel();
    // this.Mode = 'Add';
  }
  onSaveold(saveAction) {
    debugger;
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }

  //To save the Inventory Vendor details to database table by calling the API service
  onSave(saveAction) {
    debugger;
    this.submitted = true;
    if (this.InventoryVendorForm.invalid) {
      return;
    }


    //this.Loading = true;
    let inventoryvendor = new LBSINVInventoryVendor();
    inventoryvendor.CompanyID = this.CompanyId;
    inventoryvendor.InventoryID = this.InventryID;
    inventoryvendor.CreatedBY = localStorage.getItem('LoginID');
    inventoryvendor.VendorID = this.InventoryVendorForm.get('Vendor').value;
    inventoryvendor.PurchaseUOM = this.InventoryVendorForm.get('PurchaseUOM').value;
    inventoryvendor.LastPurchasedDate = this.InventoryVendorForm.get('LastPurchasedDate').value;
    inventoryvendor.Default = this.InventoryVendorForm.get('Default').value;
    inventoryvendor.LastPurchasedUnitPrice = this.InventoryVendorForm.get('LastPurchasedUnitPrice').value;
    inventoryvendor.VendorBarCode = this.InventoryVendorForm.get('VendorBarCode').value;
    // inventoryvendor.DateCreated = this.InventoryVendorForm.get('DateCreated').value;
    inventoryvendor.VendorSKU = this.InventoryVendorForm.get('VendorSKU').value;

    if (this.Mode == 'Add') {
      this.inventoryVendor.addInventoryVendor(inventoryvendor).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success(resp.message);
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindInventoryVendor();
            this.Mode = 'List';
          } else {
            this.Edit(resp.data.id);
            this.BindInventoryVendor();
            this.Mode = 'Edit';
          }
          this.Loading = false;
        }
        else {
this.toastr.warning(resp.message);
        }
      },
        (error) => {
          console.error('Problem with the sevice. Please try later : ' + error.message);
        });
    }
    else if (this.Mode == 'Edit') {
      inventoryvendor.ID = this.InventoryVendorForm.get('ID').value;
      this.inventoryVendor.UpdateInventoryVendor(inventoryvendor).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success(resp.message);
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            //this.ResetForm();
            this.BindInventoryVendor();
          }
          else {
            this.Edit(this.InventoryVendorForm.get('ID').value);
          }
        }
        else {
          this.toastr.warning(resp.message);
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    this.Loading = false;
  }


  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-pencil"></i></div>';
    return cellContent
  }
  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }

  onDeleteChecked(ID) {
    //this.Loading = true;
    this.inventoryVendor.deleteInventoryVendorByID(ID, 'LBS_INV_InventoryVendors', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        this.BindInventoryVendor();
      }
      //this.Loading = false;
    }, (error) => {
      //this.Loading = false;

      // console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}

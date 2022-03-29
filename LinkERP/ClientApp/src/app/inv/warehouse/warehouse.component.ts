import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WarehouseService } from '../services/warehouse.service';
import { LbsInvWarehouse } from 'src/app/models/inv/lbs-inv-warehouse';
import { LBSINVInventoryDetail } from 'src/app/models/inv/lbs-inv-inventory-detail';
import { ToastrService } from 'ngx-toastr';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { CustomValidators } from 'ngx-custom-validators';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css']
})
export class WarehouseComponent implements OnInit {
  WareHouseForm: FormGroup;
  Loading: any = false;
  Mode: any = 'List';
  submitted: boolean;
  //WareHouseID: any;
  WareHouse: any[] = [];//Array variable of warehouse data to bind grid
  addreadonly: boolean;
  //Ag-grid 
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false
  CompanyId = localStorage.getItem('CompanyID');
  AccessTab: any;
  SelectedWareHouseID: any;
  HeaderNames: any;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  IsActive: boolean;
  PageSize: any;
  Currentpage: string;
  constructor(
    private WareHouseService: WarehouseService,
    private WarehouseFB: FormBuilder,
    private toastr: ToastrService,
    private deleteRecordsService: DeleteRecordsService,
    private cryptoAes: CryptoAes
  ) { }

  ngOnInit() {
    this.AgLoad = false;
    this.Mode = "List";
    this.submitted = false;
    this.HeaderNames = "WareHouse";
    this.AccessTab = "WareHouse";
    //this.WareHouseID = 'D0454214-D3BB-44D2-B5FD-1B83A3556393';
    this.PageSize = "50";
    this.Currentpage = "0";
    this.BindWareHouse();

    //To create the warehouseform Form Controls
    this.WareHouseForm = this.WarehouseFB.group({
      ID: [''],
      CompanyID: [''],
      WareHouseCode: ['', Validators.required],
      WareHouseName: ['', Validators.required],
      DeliveryAddress1: [''],
      DeliveryAddress2: [''],
      DeliveryAddress3: [''],
      PostalAdderss1: [''],
      PostalAddress2: [''],
      PostalAddress3: [''],
      ContactName: [''],
      ContactPhoneNumber: [''],
      ContactEmailAddress: ['', [Validators.pattern(/^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/)]],
      WarehouseTransactionMask: ['', Validators.required],
    });
    this.SetPermissions();
    this.ColumnDefs = [
      { headerName: 'Code', field: 'wareHouseCode', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Name', field: 'wareHouseName', sortable: true, filter: true },
      { headerName: 'Contact Name', field: 'contactName', sortable: true, filter: true },
      { headerName: 'Phone Number', field: 'contactPhoneNumber', sortable: true, filter: true },
      { headerName: 'Email Address', field: 'contactEmailAddress', sortable: true, filter: true },
      { headerName: 'Transaction Mask', field: 'warehouseTransactionMask', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }
    ];
  }
  get f() { return this.WareHouseForm.controls; }
  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr)
    let index = Permissions.findIndex(c => c.menuID == "202");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.WareHouseForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.WareHouseForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.WareHouseForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }
  //Add new warehouse
  AddNew(): void {
    this.Mode = 'Add';
    //this.addreadonly = false;
    this.IsActive = true;
    this.WareHouseForm.enable();
  }
  //To bind the data of warehouse to the controls to edit/update.
  Edit(ID): void {
    this.Mode = 'Edit';
    this.SelectedWareHouseID = ID;
    this.BindWareHouseByID(ID);


    //this.addreadonly = true;
  }
  //Cancel the Add/Edit
  Cancel(): void {
    this.ResetForm();
    this.BindWareHouse();
    this.Mode = "List";
  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.Edit(event.data.id);
      this.SelectedWareHouseID = event.data.id;
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
  /* FOR Aggird End  */

  //Resetting the form after Add/Edit
  ResetForm() {
    this.WareHouseForm.patchValue({
      ID: '',
      WareHouseCode: '',
      WareHouseName: '',
      DeliveryAddress1: '',
      DeliveryAddress2: '',
      DeliveryAddress3: '',
      PostalAdderss1: '',
      PostalAddress2: '',
      PostalAddress3: '',
      ContactName: '',
      ContactPhoneNumber: '',
      ContactEmailAddress: '',
      WarehouseTransactionMask: '',
    });
    this.WareHouseForm.markAsTouched();
    this.WareHouseForm.markAsPristine();
    this.submitted = false;
  }


  //To bind the data of all warehouse to the Grid.
  BindWareHouse() {
    this.Loading = true;
    this.AgLoad = false;
    this.WareHouseService.getWareHouse().subscribe((resp: any) => {
      this.WareHouse = resp.data.warehouse;
      this.RowData = resp.data.warehouse;
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {

      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  OnCancel() {
    this.ResetForm();
    this.Mode = 'Add';
  }
  onSaveold(saveAction) {
    debugger;
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  //To save the warehouse details to database table by calling the API service
  onSave(saveAction) {
    debugger;
    this.submitted = true;
    if (this.WareHouseForm.invalid) {
      return;
    }
    this.Loading = true;
    let warehouse = new LbsInvWarehouse();
    warehouse.CompanyID = this.CompanyId;
    warehouse.WareHouseCode = this.WareHouseForm.get('WareHouseCode').value;
    warehouse.WareHouseName = this.WareHouseForm.get('WareHouseName').value;
    warehouse.DeliveryAddress1 = this.WareHouseForm.get('DeliveryAddress1').value;
    warehouse.DeliveryAddress2 = this.WareHouseForm.get('DeliveryAddress2').value;
    warehouse.DeliveryAddress3 = this.WareHouseForm.get('DeliveryAddress3').value;
    warehouse.PostalAdderss1 = this.WareHouseForm.get('PostalAdderss1').value;
    warehouse.PostalAddress2 = this.WareHouseForm.get('PostalAddress2').value;
    warehouse.PostalAddress3 = this.WareHouseForm.get('PostalAddress3').value;
    warehouse.ContactName = this.WareHouseForm.get('ContactName').value;
    warehouse.ContactPhoneNumber = this.WareHouseForm.get('ContactPhoneNumber').value;
    warehouse.ContactEmailAddress = this.WareHouseForm.get('ContactEmailAddress').value;
    warehouse.CreatedBY = localStorage.getItem('LoginID');
    warehouse.WarehouseTransactionMask = this.WareHouseForm.get('WarehouseTransactionMask').value;
    //if(this.RowData.filter(r => r.warehouseTransactionMask == warehouse.WarehouseTransactionMask)
    //If the mode is Add then it will insert data to DB table else update the row by ID
    if (this.Mode == 'Add') {
      this.RowData = this.RowData.filter(r => r.warehouseTransactionMask == warehouse.WarehouseTransactionMask && r.companyID == warehouse.CompanyID && r.deleted == 0);

      if (this.RowData.length > 0) {
        this.toastr.warning('Warehouse Transaction Mask Exists!');
        this.submitted = false;
        this.Loading = false;
        return;
      }
      this.WareHouseService.addWareHouse(warehouse).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          console.log(resp)
          this.toastr.success('Warehouse added successfully')
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindWareHouse();
            this.Mode = 'List';
          }
          else {
            this.Edit(resp.data.id);
            this.BindWareHouse();
            this.Mode = 'Edit';
          }
          // this.ResetForm();
          // this.BindWareHouse();
          // this.Edit(resp.data.id);
          // this.ResetForm();
          // this.Mode = 'Edit';
          this.Loading = false;
        }
        else {
          this.toastr.warning('Warehouse code  already exists')
          this.Loading = false;
        }
      });
    }

    else if (this.Mode == 'Edit') {
      warehouse.ID = this.WareHouseForm.get('ID').value;

      this.RowData = this.RowData.filter(r => r.warehouseTransactionMask == warehouse.WarehouseTransactionMask && r.companyID == warehouse.CompanyID && r.deleted == 0 && r.id != warehouse.ID);

      if (this.RowData.length > 0) {
        this.toastr.warning('Warehouse Transaction Mask Already Exists!');
        this.submitted = false;
        this.Loading = false;
        return;
      }
      this.WareHouseService.updateWareHouse(warehouse).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('WareHouse  details Updated successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.ResetForm();
            this.BindWareHouse();
          }
          else {

            this.Edit(this.WareHouseForm.get('ID').value);
          }
          // this.Edit(this.WareHouseForm.get('ID').value)
          // // alert(resp.message);
          // this.ResetForm();
          // this.BindWareHouse();
          // this.Mode = 'Edit';
        }
        else {
          this.toastr.warning('WareHouse code already exists')
          this.Loading = false;
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    this.Loading = false;
  }
  //Bind Warehouse by  ID
  BindWareHouseByID(ID) {
    this.WareHouseService.getWareHouseByID(ID).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        let warehouse: any = new LbsInvWarehouse();
        warehouse = resp.data.house;
        this.WareHouseForm.patchValue({
          ID: warehouse.id,
          CompanyID: warehouse.companyID,
          WareHouseCode: warehouse.wareHouseCode,
          WareHouseName: warehouse.wareHouseName,
          DeliveryAddress1: warehouse.deliveryAddress1,
          DeliveryAddress2: warehouse.deliveryAddress2,
          DeliveryAddress3: warehouse.deliveryAddress3,
          PostalAdderss1: warehouse.postalAdderss1,
          PostalAddress2: warehouse.postalAddress2,
          PostalAddress3: warehouse.postalAddress3,
          ContactName: warehouse.contactName,
          ContactPhoneNumber: warehouse.contactPhoneNumber,
          ContactEmailAddress: warehouse.contactEmailAddress,
          WarehouseTransactionMask: warehouse.warehouseTransactionMask,
        })
        if (!warehouse.deleted) {
          debugger;
          this.WareHouseForm.enable();
          this.IsActive = true;
        } else {
          this.WareHouseForm.disable();
          this.IsActive = false;
        }
      }
    },
      (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
  }



  //Delete the record
  onDeleteChecked(ID) {
    debugger;
    this.Loading = true;
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_INV_Warehouse', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.Mode = 'List';
      this.BindWareHouse();
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  AddProductWarehouse(selectedWarehouseID) {
    debugger;
    // let obj = {
    //   'CompanyID': localStorage.getItem('CompanyID'),
    //   'WarehouseID': selectedWarehouseID
    // }
    let lbsInventoryDetail = new LBSINVInventoryDetail();
    lbsInventoryDetail.CompanyID = localStorage.getItem('CompanyID');
    lbsInventoryDetail.WarehouseID = selectedWarehouseID;
    lbsInventoryDetail.CreatedBY = localStorage.getItem('LoginID');
    this.WareHouseService.updateProductWareHouse(lbsInventoryDetail).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        this.toastr.success(resp.message);
      }
      else {
        this.toastr.error(resp.message);
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }
}




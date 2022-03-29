import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InventoryKitService } from '../../services/inventory-kit.service';
import { InventoryDetailService } from '../../services/inventory-detail.service';
import { InventoryService } from '../../services/inventory.service';
import { LBSINVInventoryKitComponents } from 'src/app/models/inv/lbs-inv-inventory-kit-components';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { CustomValidators } from 'ngx-custom-validators';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';

@Component({
  selector: 'app-inventory-kit',
  templateUrl: './inventory-kit.component.html',
  styleUrls: ['./inventory-kit.component.css']
})
export class InventoryKitComponent implements OnInit {
  Mode: any = 'List';
  Submitted: any = false;
  @Input() IsInventoryActive: boolean;
  HeaderNames: any;
  CompanyId = localStorage.getItem('CompanyID');
  InventoryKitForm: FormGroup
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  AccessTab: string;
  SelectedInventryID: any;
  BindInventory: any;
  Loading: any = false;
  BindInventoryKit: any;
  @Input() InventryID: any;
  BindParentProductKit: any;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  PageSize: any;
  IsActive: boolean;
  Currentpage: string;
  constructor(
    private toastr: ToastrService,
    private inventoryKitService: InventoryKitService,
    private FB: FormBuilder,
    private inventoryService: InventoryService,
    private deleteRecordsService: DeleteRecordsService,
    private sysCommonService: SysCommonService,
    private cryptoAes: CryptoAes
  ) { }

  ngOnInit() {
    console.log(this.InventryID);
    this.AgLoad = false;
    this.PageSize = "50";
    this.BindInventoryKits();
    this.BindParentProductKits();
    this.CreateForm();
    this.Currentpage = "0";
    this.SetPermissions();
    this.ColumnDefs = [
      { headerName: 'Product Name', field: 'productName', sortable: true, filter: true, checkboxSelection: false, },
      { headerName: 'Quantity', field: 'quantity_text', sortable: true, filter: true ,type: 'numericColumn', },
      { headerName: 'Conversion Ratio ', field: 'conversionRatio_text', sortable: true, type: 'numericColumn',filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access ||!this.IsInventoryActive }
    ];
  }

  get f() { return this.InventoryKitForm.controls; }

  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  CreateForm() {
    this.InventoryKitForm = this.FB.group({
      ID: [''],
      ProductName: ['-1', CustomValidators.notEqual('-1')],
      ParentProductID: [''],
      Quantity: ['', Validators.required],
      ConversionRatio: ['', Validators.required]
    })
  }
  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr)
    let index = Permissions.findIndex(c => c.menuID == "201");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.InventoryKitForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.InventoryKitForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.InventoryKitForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }

  //To bind the data of all InventoryKits to the Grid.
  BindInventoryKits() {
    this.Mode = "List";
    this.AgLoad = false;
    this.inventoryKitService.getInventoryKitByInventoryID(this.InventryID).subscribe((resp: any) => {
      this.BindInventoryKit = resp.data.inventorykit;
      this.RowData = resp.data.inventorykit;
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //Delete the record
  onDeleteChecked(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_INV_InventoryKitComponents', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.BindInventoryKits();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onSaveold(saveAction) {
    debugger;
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  //To save the InventoryKits  to database table by calling the API service
  onSave(saveAction) {
    this.Submitted = true;
    if (this.InventoryKitForm.invalid) {
      return;
    }
    let inventoryKit = new LBSINVInventoryKitComponents();
    inventoryKit.CompanyID = this.CompanyId;
    inventoryKit.ParentProductID = this.InventryID;
    inventoryKit.KitProductID = this.InventoryKitForm.get('ProductName').value;
    inventoryKit.Quantity = this.InventoryKitForm.get('Quantity').value;
    inventoryKit.ConversionRatio =  this.InventoryKitForm.get('ConversionRatio').value;
    inventoryKit.CreatedBY = localStorage.getItem('LoginID');
    //If the mode is Add then it will insert data to DB table else update the row by ID
    if (this.Mode == 'Add') {
      this.inventoryKitService.addInventoryKit(inventoryKit).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('Component added successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindInventoryKits();
            this.Mode = 'List';
            this.ResetForm();
          } else {
            this.SelectedInventryID=this.InventryID;
            this.Edit(resp.data.id);
            this.BindInventoryKits();
            this.Mode = 'Edit';
          }
          this.Loading = false;
        }else{
          this.toastr.warning('Inventory kit already exists');
        }
      }, (error) => {
        //  console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    else if (this.Mode == 'Edit') {
      inventoryKit.ID = this.InventoryKitForm.get('ID').value;
      this.inventoryKitService.updateInventoryKit(inventoryKit).subscribe((resp: any) => {

        if (resp.isSuccess == true) {
          this.toastr.success('Component updated successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.ResetForm();
            this.BindInventoryKits();
          }
          else{
            this.Edit(this.InventoryKitForm.get('ID').value);
          }
        }else{
          this.toastr.warning('Inventory kit already exists');
        }

      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }

  }
  Edit(ID) {
   this.Mode='Edit';
this.BindInventorykitproductbyid(ID);
  }
  BindInventorykitproductbyid(ID){
    this.SelectedInventryID=this.InventryID;
    this.inventoryKitService.getinventorykitbyid(ID).subscribe((resp: any) => {
      console.log(resp);
      let measure: any = new LBSINVInventoryKitComponents();
      measure = resp.data.inventorykit;
      this.InventoryKitForm.patchValue({
        ID: measure.id,
        ProductName: measure.kitProductID,
        ParentProductID:measure.parentProductID,
        Quantity: measure.quantity_text,
        ConversionRatio: measure.conversionRatio_text
      });
      if (!measure.deleted) {
        this.InventoryKitForm.enable();
        this.IsActive = true;
      } else {
        this.InventoryKitForm.disable();
        this.IsActive = false;
      }
      if (!this.IsInventoryActive) {
        this.InventoryKitForm.disable();
      }
      this.Mode = 'Edit';

    }, (error) => {
      //  console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }
  //Cancel the Add/Edit
  Cancel() {
    this.ResetForm();
    this.BindInventoryKits();
    this.Mode = 'List';
    // let InventoryKit = {
    //   kitProductID:"-1"
    // };
    // this.BindKitDetails(InventoryKit);
  }
  ResetForm() {
    this.InventoryKitForm.patchValue({
      ID: '',
      ProductName: '-1',
      ParentProductID: '',
      Quantity: '',
      ConversionRatio: '',
    });
    this.InventoryKitForm.markAsUntouched();
    this.InventoryKitForm.markAsPristine();
    this.Submitted=false;
  }
  // OnCancel() {
  //   this.Cancel();
  //   this.Mode = 'Add';
  // }
  //Add new InventoryKit
  AddNew() {
    this.ResetForm();
    this.Mode = 'Add';
    this.IsActive = true;
    this.InventoryKitForm.enable();
  }
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.Edit(event.data.id);
    
    // this.SelectedInventryID = event.data.id;

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
  BindKitDetails(event) {
    console.log(event);
    this.SelectedInventryID = event.id;
    this.InventoryKitForm.patchValue({
      ID: event.id,
      ProductName: event.kitProductID,
      Quantity: event.quantity,
      ConversionRatio: event.conversionRatio
    });
    if (!event.deleted) {
      this.InventoryKitForm.enable();
      this.IsActive = true;
    } else {
      this.InventoryKitForm.disable();
      this.IsActive = false;
    }
  }
  //To bind the data for dropdown
  BindParentProductKits() {
    this.sysCommonService.getParentProductKits().subscribe((resp: any) => {
      this.BindParentProductKit = resp.data.productkits;
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}

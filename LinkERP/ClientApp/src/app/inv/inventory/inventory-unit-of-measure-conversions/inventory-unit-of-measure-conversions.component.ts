import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { InventoryUOMConversionService } from '../../services/inventory-uom-conversion.service';
import { LBSINVInventoryUnitOfMeasureConversions } from 'src/app/models/inv/lbs-inv-inventory-unit-of-measure-conversions';
import { UserService } from 'src/app/sys/services/user.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { GenricTableIDByName } from 'src/app/shared/enums/enum-generictables';
import { CustomValidators } from 'ngx-custom-validators';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { InventoryService } from '../../services/inventory.service';
@Component({
  selector: 'app-inventory-unit-of-measure-conversions',
  templateUrl: './inventory-unit-of-measure-conversions.component.html',
  styleUrls: ['./inventory-unit-of-measure-conversions.component.css']
})
export class InventoryUnitOfMeasureConversionsComponent implements OnInit {
  InventoryUnitOfMeasureConversionsForm: FormGroup;
  Mode: any = 'List';
  submitted: any = false;
  Loading: any = false;
  CompanyId = localStorage.getItem('CompanyID');

  //Permission
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  InventoryUnitOfMeasure: any[] = [];//Array variable of orInventoryUnitOfMeasureganisations data to bind grid
  UOMList: any[] = [];//Array variable of UOMList data to bind grid
  UOM: any[] = [];//Array variable of UOM data to bind grid
  Tempdata: any[] = [];
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  IsActive: boolean;
  @Input() SelectedUOM: any;
  @Input() InventoryID: any;
  @Input() IsInventoryActive: boolean;
  PageSize: any;
  Currentpage: string;
  measureconv: any;
  purchasedCount: any;
  constructor(
    private syscommonservice: SysCommonService,
    private toastr: ToastrService,
    private userService: UserService,
    private deleteRecordsService: DeleteRecordsService,
    private uomservice: InventoryUOMConversionService,
    private cryptoAes: CryptoAes,
    private FB: FormBuilder, private inventoryService: InventoryService) { }

  ngOnInit() {
    this.AgLoad = false;
    this.PageSize = "50";
    this.Currentpage = "0";
    this.BindInventoryUnitOfMeasureConversions();
    // this.getInventoryUnitOfMeasure();
    this.BindUOM();
    this.CreateForm();
    this.SetPermissions();
    this.AgGridColumns();
  }
  CreateForm() {
    debugger;
    this.InventoryUnitOfMeasureConversionsForm = this.FB.group({
      ID: [''],
      InventoryID: [''],
      UOMIDFrom: ['-1', CustomValidators.notEqual('-1')],
      UOMIDTo: [this.SelectedUOM],
      Ratio: ['', Validators.required]
    })
    this.InventoryUnitOfMeasureConversionsForm.get('UOMIDTo').disable();
  }
  AgGridColumns() {
    this.ColumnDefs = [
      { headerName: 'UOM From', field: 'uomFromName', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'UOM TO', field: 'uomToName', sortable: true, filter: true },
      { headerName: 'Ratio', field: 'conversionRatio_text', sortable: true, filter: true, cellStyle: { textAlign: 'left' }, },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access || !this.IsInventoryActive }
    ];
  }
  SetPermissions() {
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
      this.InventoryUnitOfMeasureConversionsForm.enable();

      if (!this.all_Access) {
        if (!this.write_Access) {
          this.InventoryUnitOfMeasureConversionsForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.InventoryUnitOfMeasureConversionsForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

    if (!this.IsInventoryActive) {
      this.InventoryUnitOfMeasureConversionsForm.disable();
    }
  }
  get f() { return this.InventoryUnitOfMeasureConversionsForm.controls; }
  //add operation
  AddNew() {
    debugger;
    this.Mode = 'Add';
    this.IsActive = true;
    this.InventoryUnitOfMeasureConversionsForm.enable();
    this.CreateForm();
  }
  //cancel
  Cancel() {
    this.ResetForm();
    this.BindInventoryUnitOfMeasureConversions();
    this.Mode = 'List';
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      {
        // this.inventoryService.GetProductPurchasedCount(this.InventoryID, event.data.id).subscribe((resp: any) => {
        //   this.purchasedCount = resp.data.purchasedCount;
        //   if (this.purchasedCount != null) {
        //     //this.toastr.warning('Product Purchased using this UOM, Cant Delete!');
        //     this.InventoryUnitOfMeasureConversionsForm.get('UOMIDFrom').disable();
        //     this.InventoryUnitOfMeasureConversionsForm.get('UOMIDTo').disable();
        //     return;
        //   }
        //   else {
        //     this.AgEdit(event.data);
        //   }
        // }, (error) => {
        //   this.toastr.error(error);
        //   console.error('Problem with the sevice. Please try later : ' + error);
        // });
        this.AgEdit(event.data);
      }
    } else if (colId == 'Delete') {
      //this.onDelete(event.data.id);
      //As per bug no 1222
      this.inventoryService.AvailableStocktoDelete(this.InventoryID).subscribe((resp: any) => {
        // this.availbleStock = resp.data.availableStock;
        if (resp.data.availableStock != null) {
          //this.toastr.warning('Stock Available for this Product, Cannot be marked as Inactive');
          this.toastr.warning('Product Purchased using this UOM, Cannot be marked as Inactive');
          return;
        }
        else {
          this.onDelete(event.data.id);
        }

      }, (error) => {
        this.toastr.error(error);
        console.error('Problem with the sevice. Please try later : ' + error);
      });

    }
  }
  /* FOR Aggird end */
  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-pencil"></i></div>';
    return cellContent
  }
  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }
  //bindinventory
  BindInventoryUnitOfMeasureConversions() {
    this.Loading = true;
    this.Mode = 'List';
    this.AgLoad = false;
    this.syscommonservice.getInventoryUnitOfMeasure(this.InventoryID).subscribe((resp: any) => {
      this.InventoryUnitOfMeasure = resp.data.inventoryunitofmeasure;
      this.RowData = resp.data.inventoryunitofmeasure;
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //bind unit of measure
  BindUOM() {
    debugger;
    this.syscommonservice.getLookupByID(GenricTableIDByName.LBS_INV_UnitOfMeasure).subscribe((resp: any) => {
      this.UOMList = resp.data.tabledata;
      this.ToUom = resp.data.tabledata;
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
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }

  //To save the unit details to database table by calling the API service
  onSave(saveAction) {
    this.submitted = true;
    if (this.InventoryUnitOfMeasureConversionsForm.invalid) {
      return;
    }
    // this.Loading = true;
    let UOM = new LBSINVInventoryUnitOfMeasureConversions();
    UOM.CompanyID = this.CompanyId;
    UOM.InventoryID = this.InventoryID;
    UOM.UOMIDFrom = this.InventoryUnitOfMeasureConversionsForm.get('UOMIDFrom').value;
    UOM.UOMIDTo = this.InventoryUnitOfMeasureConversionsForm.get('UOMIDTo').value;
    UOM.ConversionRatio = this.InventoryUnitOfMeasureConversionsForm.get('Ratio').value;
    UOM.CreatedBY = localStorage.getItem('LoginID');
    if (this.Mode == 'Add') {
      this.uomservice.addInventoryUnitOfMeasure(UOM).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('Inventory UOM Details added successfully');
          if (saveAction == 'Close') {
            this.Cancel();

            this.Mode = 'List';
            this.ResetForm();
          }
          else {
            // this.InventoryID=resp.data.inventoryID;
            this.Edit(resp.data.id);
            this.BindInventoryUnitOfMeasureConversions();
            this.Mode = 'Edit';
            //   this.ResetForm();
          }
          this.Loading = false;
        } else {
          // alert(resp);
        }


      }, (error) => {
        //   console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
    else if (this.Mode == 'Edit') {
      UOM.ID = this.InventoryUnitOfMeasureConversionsForm.get('ID').value;
      this.uomservice.updateInventoryUnitOfMeasure(UOM).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('Inventory UOM Details updated successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.ResetForm();
            this.BindInventoryUnitOfMeasureConversions();
          }
          else {
            this.Edit(this.InventoryUnitOfMeasureConversionsForm.get('ID').value);
          }

        } else {
          // alert(resp);

        }


      }, (error) => {
        //  console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
    //  this.ResetForm();
    this.Loading = false;
  }
  //Resetting the form after Add/Edit
  ResetForm() {
    this.InventoryUnitOfMeasureConversionsForm.patchValue({
      ID: '',
      UOMIDFrom: '-1',
      UOMIDTo: '-1',
      Ratio: '',

    });
    this.InventoryUnitOfMeasureConversionsForm.markAsUntouched();
    this.InventoryUnitOfMeasureConversionsForm.markAsPristine();
    this.submitted = false;
  }
  //edit operation
  AgEdit(event) {
    console.log(event);
    this.measureconv = this.InventoryID;
    this.OnUomIDFromChange(event.uomidFrom);
    this.InventoryUnitOfMeasureConversionsForm.patchValue({
      ID: event.id,
      InventoryID: event.inventoryID,
      UOMIDFrom: event.uomidFrom,
      UOMIDTo: event.uomidTo,
      Ratio: event.conversionRatio_text
    });
    this.inventoryService.GetProductPurchasedCount(this.InventoryID, event.uomidFrom).subscribe((resp: any) => {
      this.purchasedCount = resp.data.purchasedCount;
      if (this.purchasedCount != null) {
        //this.toastr.warning('Product Purchased using this UOM, Cant Delete!');
        this.InventoryUnitOfMeasureConversionsForm.get('UOMIDFrom').disable();
        this.InventoryUnitOfMeasureConversionsForm.get('UOMIDTo').disable();
        return;
      }
      else {
        this.InventoryUnitOfMeasureConversionsForm.get('UOMIDFrom').enable();
      }
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
    if (!event.deleted) {
      this.InventoryUnitOfMeasureConversionsForm.enable();
      this.IsActive = true;
    } else {
      this.InventoryUnitOfMeasureConversionsForm.disable();
      this.IsActive = false;
    }
    if (!this.IsInventoryActive) {
      this.InventoryUnitOfMeasureConversionsForm.disable();
    }
    this.Mode = 'Edit';
  }
  Edit(ID) {
    this.measureconv = this.InventoryID;
    this.uomservice.getInventoryUnitOfMeasureByID(ID).subscribe((resp: any) => {
      console.log(resp);
      let measure: any = new LBSINVInventoryUnitOfMeasureConversions();
      measure = resp.data.uoMdetails;
      this.InventoryUnitOfMeasureConversionsForm.patchValue({
        ID: measure.id,
        InventoryID: measure.inventoryID,
        UOMIDFrom: measure.uomidFrom,
        UOMIDTo: measure.uomidTo,
        Ratio: measure.conversionRatio_text,
      });
      if (!measure.deleted) {
        this.InventoryUnitOfMeasureConversionsForm.enable();
        this.IsActive = true;
      } else {
        this.InventoryUnitOfMeasureConversionsForm.disable();
        this.IsActive = false;
      }

      this.Mode = 'Edit';

    }, (error) => {
      //  console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }
  //delete record
  onDelete(ID) {
    debugger;
    //this.GetProductPurchasedCount(this.InventoryID, ID);
    this.inventoryService.GetProductPurchasedCount(this.InventoryID, ID).subscribe((resp: any) => {
      this.purchasedCount = resp.data.purchasedCount;
      if (this.purchasedCount != 0) {
        this.toastr.warning('Product Purchased using this UOM, Cannot be marked as Inactive');
        // this.InventoryUnitOfMeasureConversionsForm.get('UOMIDFrom').disable();
        // this.InventoryUnitOfMeasureConversionsForm.get('UOMIDTo').disable();
        return;
      }
      else {
        this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_INV_InventoryUnitOfMeasureConversions', localStorage.getItem('LoginID')).subscribe((resp: any) => {
          //this.toastr.success('Inventory UOM  details deleted successfully');
          this.BindInventoryUnitOfMeasureConversions();
          this.ResetForm();
          this.Mode = 'List';
        }, (error) => {
          console.error('Problem with the sevice. Please try later : ' + error);
        });
      }
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  ToUom: any[] = [];
  OnUomIDFromChange(ID) {
    if (ID != '-1') {
      //this.ToUom = this.UOMList.filter(u => u.id != ID);
    }
  }

  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;

  GetProductPurchasedCount(productID, uomID) {
    debugger;
    this.inventoryService.GetProductPurchasedCount(productID, uomID).subscribe((resp: any) => {
      this.purchasedCount = resp.data.purchasedCount;
      if (this.purchasedCount != null) {
        this.toastr.warning('Products Purchased using this UOM, Cant Delete!');
        return;
      }
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
}



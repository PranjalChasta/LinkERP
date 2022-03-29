import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/sys/services/user.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { InventoryService } from '../../services/inventory.service';
import { LBSINVInventory } from 'src/app/models/inv/lbs-inv-inventory';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';

@Component({
  selector: 'app-inventory-prescription',
  templateUrl: './inventory-prescription.component.html',
  styleUrls: ['./inventory-prescription.component.css']
})
export class InventoryPrescriptionComponent implements OnInit {
  AccessTab: string;
  InventoryPrescriptionForm: FormGroup;
  Mode: any = 'List';
  submitted: any = false;
  InventoryPrescription: any[] = [];
  Loading: any = false;
  CompanyId = localStorage.getItem('CompanyID');
  //Permission
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  IsActive: boolean;
  // @Input() BindPrescriptionPrice:any;
  @Input() InventoryID: any;
  @Input() IsInventoryActive: boolean;
  @Output() onModeChange = new EventEmitter<any>();
  PageSize: any;
  inventoryPrescriptionWarning: any;
  SelectedInventryID: any;
  constructor(private syscommonservice: SysCommonService,
    private toastr: ToastrService,
    private userService: UserService, private inventoryService: InventoryService,
    private deleteRecordsService: DeleteRecordsService, private cryptoAes: CryptoAes,
    private FB: FormBuilder) { }

  ngOnInit() {
    //  console.log(this.inventoryPrescriptionWarning);
    this.AgLoad = false;
    this.PageSize = "50";
    this.AccessTab = 'InventoryPrescription';
    this.BindInventories();
    this.GetInventoryByID();
    this.CreateForm();
    this.SetPermissions();
    //this.AgGridColumns();
  }
  CreateForm() {
    this.InventoryPrescriptionForm = this.FB.group({
      ID: [''],
      InventoryID: [''],
      PrescriptionInstructions: [''],
      PrescriptionSpecialInstructions: [''],
      PrescriptionCareInstructions: [''],
      PrescriptionWarning: ['']
    })
  }
  AgGridColumns() {
    this.ColumnDefs = [
      { headerName: 'Instructions', field: 'prescriptionInstructions', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'SpecialInstructions', field: 'prescriptionSpecialInstructions', sortable: true, filter: true },
      { headerName: 'CareInstructions', field: 'prescriptionCareInstructions', sortable: true, filter: true, },
      { headerName: 'Warning', field: 'prescriptionWarning', sortable: true, filter: true, type: 'numericColumn', },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      //   { headerName: '', field: 'Edit', type: 'EditAction', hide: false, },
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
      this.InventoryPrescriptionForm.enable();

      if (!this.all_Access) {
        if (!this.write_Access) {
          this.InventoryPrescriptionForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.InventoryPrescriptionForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

    if (!this.IsInventoryActive) {
      this.InventoryPrescriptionForm.disable();
    }
  }
  get f() { return this.InventoryPrescriptionForm.controls; }
  //add operation
  AddNew() {
    this.Mode = 'Add';
    this.IsActive = true;
  }
  Edit() {
    this.Mode = 'Edit';
    this.IsActive = true;
  }
  OnModeChanged() {
    this.onModeChange.emit('List');
  }
  Back() {
    this.OnModeChanged();
  }
  Cancel() {
    this.ResetForm();
  }
  ResetForm() {
    this.InventoryPrescriptionForm.patchValue({
      ID: '',
      PrescriptionInstructions: '',
      PrescriptionSpecialInstructions: '',
      PrescriptionCareInstructions: '',
      PrescriptionWarning: ''

    });
    this.InventoryPrescriptionForm.markAsUntouched();
    this.InventoryPrescriptionForm.markAsPristine();
    this.submitted = false;
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    // console.log($event.target.value)
  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      //  this.AgEdit(event.data)
    } else if (colId == 'Delete') {
      // this.onDelete(event.data.id)
    }
  }

  BindDetails(event) {
    console.log(event);
    this.SelectedInventryID = event.InventoryID;
    //this.IsInventoryKit = event.customKit
    this.InventoryPrescriptionForm.patchValue({
      ID: event.id,
      ProductCode: event.productCode,
      ProductName: event.productName,
      CategoryID: event.categoryID,
      SubCategoryID: event.subCategoryID,
      UnitofMeasure: event.unitOfMeasureID,
      InventoryDefaultCost: event.inventoryDefaultCost,
      Tax: event.taxID,
      Weight: event.weight_text,
      Height: event.height_text,
      Width: event.width_text,
      Length: event.length_text,
      PriceGroup: event.priceGroupID,
      StockTakeCycle: event.stocktakeCycleID,
      ProductStatus: event.productStatus,
      AllowPurchase: event.allowPurchase,
      MinimumProfitPercentage: event.minimumProfitPercentage,
      ProductStyleMatrixEnabled: event.productStyleMatrixEnabled,
      ProductStyleMatrixColumn: event.productStyleMatrixColumn,
      ProductStyleMatrixRow: event.productStyleMatrixRow,
      UseWareHousePrice: event.useWareHousePrice,
      SerialisedProduct: event.serialisedProduct,
      BulkItem: event.bulkItem,
      AllowDiscount: event.allowDiscount,
      CustomKit: event.customKit,
      GiftVoucher: event.giftVoucher,
      Websellable: event.websellable,
      PrescriptionInstructions: event.prescriptionInstructions,
      PrescriptionSpecialInstructions: event.prescriptionSpecialInstructions,
      PrescriptionCareInstructions: event.prescriptionCareInstructions,
      PrescriptionWarning: event.prescriptionWarning,
    });

    this.Mode = 'Edit';
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
  BindInventories() {
    this.AgLoad = false;
    this.Mode = "List";
    //  this.InventoryPrescription=[];
    this.inventoryService.getInventories().subscribe((resp: any) => {
      this.InventoryPrescription = resp.data.inventory;
      //  this.inventoryPrescriptionWarning = resp.data.inventory[0].prescriptionWarning;
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  GetInventoryByID() {
    //   this.Loading=true;
    this.inventoryService.getInventoryByID(this.InventoryID).subscribe((resp: any) => {
      if (resp.isSuccess) {
        this.BindDetails(resp.data.inventorydetails);
        //  this.Loading=false;
      }
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  onSave(saveAction) {
    debugger;
    this.submitted = true;
    if (this.InventoryPrescriptionForm.invalid) {
      return;
    }
    // // this.Loading = true;
    let Prescription = new LBSINVInventory();
    Prescription.CompanyID = this.CompanyId;
    Prescription.ID = this.InventoryID;
    Prescription.PrescriptionInstructions = this.InventoryPrescriptionForm.get('PrescriptionInstructions').value;
    Prescription.PrescriptionSpecialInstructions = this.InventoryPrescriptionForm.get('PrescriptionSpecialInstructions').value;
    Prescription.PrescriptionCareInstructions = this.InventoryPrescriptionForm.get('PrescriptionCareInstructions').value;
    Prescription.PrescriptionWarning = this.InventoryPrescriptionForm.get('PrescriptionWarning').value;
    if (this.Mode == 'Edit') {
      this.inventoryService.updateinventoryPrescription(Prescription).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success('Inventory Prescription Details updated successfully');
          if (saveAction == 'Close') {
            this.GetInventoryByID();
            this.Mode = 'Edit';          }
          else {
            this.GetInventoryByID();
          }
          this.Loading = false;
        } else {
          // alert(resp);
        }


      }, (error) => {
        //   console.error('Problem with the sevice. Please try later : ' + error);
      });
    }

  }




  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}

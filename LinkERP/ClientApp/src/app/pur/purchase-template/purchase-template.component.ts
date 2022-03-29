import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PurchaseTemplateService } from 'src/app/inv/services/purchase-template.service';
import { LbsPurPurchaseTemplate } from 'src/app/models/pur/lbs-pur-purchase-template';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { CustomValidators } from 'ngx-custom-validators';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { GenricTableIDByName } from 'src/app/shared/enums/enum-generictables';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';

@Component({
  selector: 'app-purchase-template',
  templateUrl: './purchase-template.component.html',
  styleUrls: ['./purchase-template.component.css']
})
export class PurchaseTemplateComponent implements OnInit {
  Mode: any = 'List';
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false
  PurchaseTemplateForm: FormGroup;
  TemplateSearchForm: FormGroup;
  submitted: boolean;
  templates: any;
  WareHouse: any;
  vendorslist: any;
  vendorWareHouse: any;
  CompanyID = localStorage.getItem('CompanyID');
  SelectedTemplateID: any;
  AccessTab: string;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  IsActive: boolean;
  modalRef: BsModalRef;
  Loading: any = false;
  PageSize: any;
  Currentpage: string;
  CategoryList: any;
  SubCategoryList: any;
  @Output() WareHouseId: any;


  constructor(
    private FB: FormBuilder,
    private toastr: ToastrService,
    private sysCommonService: SysCommonService,
    private deleteRecordsService: DeleteRecordsService,
    private commonService: InvCommonService,
    private purchaseTemplateService: PurchaseTemplateService,
    private cryptoAes: CryptoAes,
    public modalService: BsModalService
  ) {
  }

  ngOnInit() {
    this.Mode = "List";
    this.AccessTab = "Template";
    this.CreateForm();
    this.AgGridColumns();
    this.BindPurchaseTemplate();
    this.BindWareHouse();
    this.BindVendor();
    this.BindVendorWareHouse();
    this.SetPermissions();
    this.CreateSearchForm();
    this.BindCategory();
    this.PageSize = "50";
    this.Currentpage = "0";
  }
  SetPermissions() {
    debugger;
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "302");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.PurchaseTemplateForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.PurchaseTemplateForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.PurchaseTemplateForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  CreateForm() {
    this.PurchaseTemplateForm = this.FB.group({
      ID: [''],
      Vendor: ['-1', CustomValidators.notEqual('-1')],
      VendorWareHouse: ['-1', CustomValidators.notEqual('-1')],
      Warehouse: ['-1', CustomValidators.notEqual('-1')],
      Attentionto: ['', Validators.required],
      AttentionPhone: ['', Validators.required],
      Description: ['', Validators.required],
    })
  }
  CreateSearchForm() {
    this.TemplateSearchForm = this.FB.group({
      ID: [''],
      VendorSearch: ['-1', CustomValidators.notEqual('-1')],
      VendorSearchWareHouse: ['-1', CustomValidators.notEqual('-1')],
      WarehouseSearch: ['-1', CustomValidators.notEqual('-1')],
      Category: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')],
      SubCategory: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')],
    })
  }
  AgGridColumns() {
    this.ColumnDefs = [
      { headerName: 'Description', field: 'description', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Vendor', field: 'vendorAccountName', sortable: true, filter: true, },
      { headerName: 'WareHouse', field: 'wareHouseName', sortable: true, filter: true, },
      { headerName: 'Vendor WareHouse', field: 'description', sortable: true, filter: true, },
      { headerName: 'Attention to', field: 'attentionto', sortable: true, filter: true },
      { headerName: 'Attention Phone', field: 'attentionPhone', sortable: true, filter: true },
      // { headerName: 'Date Created', field: 'dateCreated', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: false }
    ];
  }
  get f() { return this.PurchaseTemplateForm.controls; }
  get fs() { return this.TemplateSearchForm.controls; }
  //To bind the data of PurchaseTemplate to controls.
  BindPurchaseTemplate() {
    debugger;
    this.AgLoad = false;
    this.purchaseTemplateService.getPurchaseTemplate().subscribe((resp: any) => {
      debugger;
      this.templates = resp.data.template;
      this.RowData = resp.data.template;
      this.AgLoad = true;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //To bind the data of all warehouse to the Grid.
  BindWareHouse() {
    this.Loading = true;
    this.AgLoad = false;
    this.commonService.getWareHouse().subscribe((resp: any) => {
      this.WareHouse = resp.data.warehouse;
      this.AgLoad = true;
      this.Loading = false;
    }, (error) => {

      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //To bind the data of all warehouse to the Grid.
  BindVendor() {
    // this.Loading = true;
    this.commonService.getVendor().subscribe((resp: any) => {
      this.vendorslist = resp.data.vendors;
      // this.Loading = false;
    }, (error) => {

      // this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }


  //To bind the data of all warehouse to the Grid.
  BindVendorWareHouse() {
    // this.Loading = true;
    this.purchaseTemplateService.getVendorWareHouse().subscribe((resp: any) => {
      debugger;
      this.vendorWareHouse = resp.data.vendorWareHouse;

      // this.Loading = false;
    }, (error) => {

      // this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //Add new PurchaseTemplate
  AddNew(): void {
    this.Mode = 'Add';
    this.IsActive = true;
    this.CreateSearchForm();
    this.PurchaseTemplateForm.enable();
    //this.read=true;
  }
  //Cancel the Add/Edit
  Cancel(): void {
    this.ResetForm();
    this.submitted = false;
    this.Mode = "List";
    this.BindPurchaseTemplate();
  }

  //To bind the data of States to the controls to edit/update.
  Edit(ID): void {
    this.BindPurchaseTemplateByID(ID);
    this.Mode = 'Edit';
  }

  BindPurchaseTemplateByID(ID) {
    //this.SelectedTemplateID = ID;
    debugger;
    this.purchaseTemplateService.getPurchaseTemplateByID(ID).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        let purchasetemplte: any = new LbsPurPurchaseTemplate();
        purchasetemplte = resp.data.purchaseDetails;
        console.log(purchasetemplte);
        this.PurchaseTemplateForm.patchValue({
          ID: purchasetemplte.id,
          Vendor: purchasetemplte.vendorID,
          Warehouse: purchasetemplte.warehouseID,
          VendorWareHouse: purchasetemplte.vendorWareHouseID,
          Attentionto: purchasetemplte.attentionto,
          AttentionPhone: purchasetemplte.attentionPhone,
          Description: purchasetemplte.description,
        });
        this.WareHouseId = purchasetemplte.warehouseID;
        if (!purchasetemplte.deleted) {
          this.PurchaseTemplateForm.enable();
          this.IsActive = true;
        } else {
          this.PurchaseTemplateForm.disable();
          this.IsActive = false;
        }
      }
    });
    (error) => {
      console.error('Problem with the sevice. Please try later : ' + error.message);
    }
  }

  onSaveold(saveAction) {
    debugger;
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  onSearchSave(saveAction){
    this.submitted = true;
    if (this.TemplateSearchForm.invalid) {
      return;
    }
    this.submitted = false;
    let purchasetemplates = new LbsPurPurchaseTemplate();
    purchasetemplates.CompanyID = this.CompanyID;
    purchasetemplates.VendorID = this.TemplateSearchForm.get('VendorSearch').value;
    purchasetemplates.WarehouseID = this.TemplateSearchForm.get('WarehouseSearch').value;
    this.WareHouseId = purchasetemplates.WarehouseID;
    purchasetemplates.VendorWareHouseID = this.TemplateSearchForm.get('VendorSearchWareHouse').value;
    purchasetemplates.Category = this.TemplateSearchForm.get('Category').value;
    purchasetemplates.SubCategory = this.TemplateSearchForm.get('SubCategory').value;
    purchasetemplates.CreatedBY = localStorage.getItem('LoginID');
    this.purchaseTemplateService.SearchPurchaseTemplate(purchasetemplates).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        this.toastr.success('PurchaseTemplate  added successfully');
        if (saveAction == 'Close') {
          this.BindPurchaseTemplate();
          this.Cancel();
          this.Mode = 'List';
          this.ResetForm();
        }
        else{
          this.SelectedTemplateID=resp.data.id;
          this.Edit(resp.data.id);
          this.BindPurchaseTemplate();

        }

         //this.Loading = false;
      }
      else {
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }
  onSave(saveAction) {
    debugger;
    this.submitted = true;
    if (this.PurchaseTemplateForm.invalid) {
      return;
    }
    //this.Loading = true;
    let purchasetemplates = new LbsPurPurchaseTemplate();
    purchasetemplates.Description = this.PurchaseTemplateForm.get('Description').value;
    purchasetemplates.CompanyID = this.CompanyID;
    purchasetemplates.VendorID = this.PurchaseTemplateForm.get('Vendor').value;
    purchasetemplates.WarehouseID = this.PurchaseTemplateForm.get('Warehouse').value;
    this.WareHouseId = purchasetemplates.WarehouseID;
    purchasetemplates.VendorWareHouseID = this.PurchaseTemplateForm.get('VendorWareHouse').value;
    purchasetemplates.Attentionto = this.PurchaseTemplateForm.get('Attentionto').value;
    purchasetemplates.AttentionPhone = this.PurchaseTemplateForm.get('AttentionPhone').value;
    purchasetemplates.CreatedBY = localStorage.getItem('LoginID');
    if (this.Mode == 'Add') {
      this.purchaseTemplateService.addPurchaseTemplate(purchasetemplates).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('PurchaseTemplate  added successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindPurchaseTemplate();
            this.Mode = 'List';
            this.ResetForm();
          }
          else {
            this.SelectedTemplateID = resp.data.id;
            this.Edit(resp.data.id);
            this.BindPurchaseTemplate();

          }

          //this.Loading = false;
        }
        else {
        }
      },
        (error) => {
          console.error('Problem with the sevice. Please try later : ' + error.message);
        });
    }
    else if (this.Mode == 'Edit') {
      purchasetemplates.ID = this.PurchaseTemplateForm.get('ID').value;
      this.purchaseTemplateService.UpdatePurchaseTemplate(purchasetemplates).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('PurchaseTemplate details updated successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindPurchaseTemplate();
            this.Mode = 'List';
            this.ResetForm();
          }
          else {
            // this.ResetForm();
            // this.BindPurchaseTemplate();
            // this.submitted = false;
            // this.Mode = 'List';
            let ID = this.PurchaseTemplateForm.get('ID').value;
            // this.ResetForm();
            this.Edit(ID);
          }

        }
        else {
          alert(resp.message);
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.Edit(event.data.id)
      this.SelectedTemplateID = event.data.id;
    } else if (colId == 'Delete') {
      this.OnDeletetemplete(event.data.id)
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

  //To create the States Form Controls.
  ResetForm() {
    // this.TemplateSearchForm = this.FB.group({
    //   ID: [''],
    //   VendorSearch: ['-1', CustomValidators.notEqual('-1')],
    //   VendorSearchWareHouse: ['-1', CustomValidators.notEqual('-1')],
    //   WarehouseSearch: ['-1', CustomValidators.notEqual('-1')],
    //   Category: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')],
    //   SubCategory: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')],
    // })
    this.PurchaseTemplateForm.patchValue({
      ID: '',
      Description: '',
      Vendor: '-1',
      Warehouse: '-1',
      VendorWareHouse: '-1',
      Attentionto: '',
      AttentionPhone: ''
    });
  }
  OnDeletetemplete(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_PUR_PurchaseTemplate', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      // this.toastr.success('Currency  details deleted successfully');
      //   this.BindInventoryProductPriceDetails();
      this.BindPurchaseTemplate();
      //this.ResetForm();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  ConfirmDialogClose() {
    this.modalRef.hide();
  }
  BindCategory() {
    this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_INV_Categories).subscribe((resp: any) => {
      console.log(resp);
      this.CategoryList = resp.data.tabledata;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
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
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}

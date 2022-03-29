import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PurchaseTemplateDetailService } from '../../services/purchase-template-detail.service';
import { EnumExtension } from 'src/app/shared/enums/enum-extension';
import { ProductType } from 'src/app/shared/enums/product-type';
import { PurchaseLineStatus } from 'src/app/shared/enums/purchase-line-status';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { GenricTableIDByName } from 'src/app/shared/enums/enum-generictables';
import { PurchaseTemplateService } from 'src/app/inv/services/purchase-template.service';
import { InventoryService } from 'src/app/inv/services/inventory.service';
import { LBSPURPurchaseTemplateDetail } from 'src/app/models/pur/lbs-pur-purchase-template-detail';
import { CustomValidators } from 'ngx-custom-validators';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';

@Component({
  selector: 'app-purchase-template-detail',
  templateUrl: './purchase-template-detail.component.html',
  styleUrls: ['./purchase-template-detail.component.css']
})
export class PurchaseTemplateDetailComponent implements OnInit {
  @Input() TemplateID: any;
  @Input() WareHouseId:any;
  @Input() IsParentActive:boolean;
  Mode: any = 'List';
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false
  TemplateDetailForm: FormGroup;
  submitted: boolean;
  templateDetail: any;
  private purproductList //= EnumExtension.getNamesAndValues(ProductTypeStatus);
  private LineList //= EnumExtension.getNamesAndValues( PurchaseLineStatus);
  UOMList: any;
  templates: any;
  classification: any;
  BindInventory: any;
  inventoryList: any;
  IsInventory: boolean;
  AccessTab: string;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  modalRef: BsModalRef;
  CompanyID = localStorage.getItem('CompanyID');
  read: boolean;
  IsActive: boolean;
  PageSize: any;
  Currentpage: string;
  ProductDescription: any;
  constructor(
    private FB: FormBuilder,
    private toastr: ToastrService,
    private purchaseTemplateService: PurchaseTemplateDetailService,
    private sysCommonService: SysCommonService,
    private cryptoAes: CryptoAes,
    private purchasetemplateService: PurchaseTemplateService,
    private commonService: InvCommonService,
    public modalService: BsModalService
  ) { }

  ngOnInit() {
    this.purproductList = EnumExtension.getNamesAndValuestring(ProductType);
    this.LineList = EnumExtension.getNamesAndValuestring(PurchaseLineStatus);

    this.AgLoad = false;
    this.Mode = "List";
    this.CreateForm();
    this.AgGridColumns();
    this.SetPermissions();
    this.TemplateDetailForm.patchValue({
      PurchaseLineStatus: 'New'
    })
    this.BindTemplateDetailByID();
     this.BindUOM();
    //this.BindPurchaseTemplate();
    this.BindClassification();

    this.PageSize = "50";
    this.Currentpage = "0";
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
    console.log($event.target.value)
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  SetPermissions() {
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
      this.TemplateDetailForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.TemplateDetailForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.TemplateDetailForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }
  }
  CreateForm() {
    this.TemplateDetailForm = this.FB.group({
      ID: [''],
      Quantity: [0,],
      ProductDescription: [''],
      ProductType: ['INV'],
      Product: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')],
      Classification: ['-1'],
      PurchaseUOM: ['00000000-0000-0000-0000-000000000000'],
    })
  }
  AgGridColumns() {
    this.ColumnDefs = [
      { headerName: 'ProductType', field: 'productType', sortable: true, filter: true, checkboxSelection: false, width: 95, },
      { headerName: 'Product Description', field: 'productDescription', sortable: true, filter: true },
      { headerName: 'Quantity', field: 'quantity', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: false }
    ];
  }
  get f() { return this.TemplateDetailForm.controls; }
  BindTemplateDetailByID() {
    this.AgLoad = false;
    this.Mode = "List";
    this.purchaseTemplateService.getPurchaseTemplateByID(this.TemplateID).subscribe((resp: any) => {
      console.log(resp.data.purchaseDetails);
      this.templateDetail = resp.data.purchaseDetails;
      this.RowData = resp.data.purchaseDetails;
      this.AgLoad = true;
      this.BindInventoryDetail();

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //To bind the data of UOM to controls.
  BindUOMold() {
    this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_INV_UnitOfMeasure).subscribe((resp: any) => {
      this.UOMList = resp.data.tabledata;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  /* BindPurchaseTemplate() {
    this.AgLoad = false;
    this.purchasetemplateService.getActivePurchaseTemplates().subscribe((resp: any) => {
      this.templates = resp.data.template;
      //this.RowData = resp.data.template;
      this.AgLoad = true;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }   */

  BindClassification() {
    this.AgLoad = false;
    this.purchaseTemplateService.getClassificationDetail().subscribe((resp: any) => {
      this.classification = resp.data.classifications;
      this.AgLoad = true;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  BindInventoryDetail() {
    this.AgLoad = false;
    this.commonService.getInvetoryForPO().subscribe((resp: any) => {
      this.inventoryList = resp.data.inventoryforPO;
      this.AgLoad = true;
      for (let i = 0; i < this.RowData.length; i++) {
        let index = this.inventoryList.findIndex(c => c.id == this.RowData[i].productID);
        if (index >= 0) {
          this.RowData[i].productDescription = this.inventoryList[index].productName;
        }
      }

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  productTypeStatus(ID) {
    this.TemplateDetailForm.enable();
    /* if (ID == "INV") {
      this.TemplateDetailForm.get('ProductDescription').disable();
      this.TemplateDetailForm.get('Product').enable();
    }
    else if (ID == "Non") {
      this.IsInventory = false;
      this.TemplateDetailForm.patchValue({
        Product: '00000000-0000-0000-0000-000000000000',
        ProductDescription: '',
        PurchaseUOM: '00000000-0000-0000-0000-000000000000'
      });
      this.TemplateDetailForm.get('Product').disable();
      this.TemplateDetailForm.get('ProductDescription').enable();
    } else {
      //Comment
      this.TemplateDetailForm.patchValue({
        Product: '00000000-0000-0000-0000-000000000000',
        ProductDescription: ''
      });
      this.TemplateDetailForm.disable();
      this.TemplateDetailForm.get('ProductDescription').enable();
      this.TemplateDetailForm.get('ProductType').enable();
    } */
    if (ID == "INV") {
      this.TemplateDetailForm.get('ProductDescription').disable();
      this.TemplateDetailForm.get('Product').enable();
      this.TemplateDetailForm.get('PurchaseUOM').enable();
      this.TemplateDetailForm.get('Quantity').enable();
    }
    else  if (ID == "Com") {
      this.IsInventory = false;
      this.TemplateDetailForm.patchValue({
        Product: null,
        ProductDescription:'',
        PurchaseUOM:null,
        Quantity: null,
      });
      this.TemplateDetailForm.get('PurchaseUOM').disable();
      this.TemplateDetailForm.get('Quantity').disable();
      this.TemplateDetailForm.get('Product').disable();
      this.TemplateDetailForm.get('ProductDescription').enable();
      }
    else {
      this.IsInventory = false;
      this.TemplateDetailForm.patchValue({
        Product: '',
        ProductDescription:''
      });
      this.TemplateDetailForm.get('Product').disable();
      this.TemplateDetailForm.get('ProductDescription').enable();
      this.TemplateDetailForm.get('PurchaseUOM').enable();
      this.TemplateDetailForm.get('Quantity').enable();
    }
  }

  onSaveold(saveAction) {
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  onSave(saveAction) {
    this.submitted = true;
    if (this.TemplateDetailForm.invalid) {
      return;
    }
    //this.Loading = true;
    let purchasetemplates = new LBSPURPurchaseTemplateDetail();
    purchasetemplates.ProductDescription = this.TemplateDetailForm.get('ProductDescription').value;
    purchasetemplates.CompanyID = this.CompanyID;
    purchasetemplates.PurchaseTemplateID = this.TemplateID;
    purchasetemplates.Quantity = this.TemplateDetailForm.get('Quantity').value;
    purchasetemplates.ProductType = this.TemplateDetailForm.get('ProductType').value;
    purchasetemplates.ProductID = this.TemplateDetailForm.get('Product').value;
    purchasetemplates.ClassificationID = this.TemplateDetailForm.get('Classification').value;
    purchasetemplates.UnitOfMeasure = this.TemplateDetailForm.get('PurchaseUOM').value;
    //purchasetemplates.PurchaseLineStatus = this.TemplateDetailForm.get('PurchaseLineStatus').value;
    purchasetemplates.CreatedBY = localStorage.getItem('LoginID');
    if (this.Mode == 'Add') {
      this.purchaseTemplateService.addPurchaseTemplateDetail(purchasetemplates).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('PurchaseTemplate Detail details added successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindTemplateDetailByID();
            this.Mode = 'List';
            this.ResetForm();
          }
          else {
            /// this.Mode = 'Edit';
            this.Mode = 'List';
            // this.AgEdit(resp.data.id);
            //  this.Mode = 'Edit';
            this.BindTemplateDetailByID();
          }
          // this.ResetForm();
          // this.BindTemplateDetailByID();
          // this.Mode = 'List';
          // this.submitted = false;
          // this.Loading = false;
        }
        else {
        }
      },
        (error) => {
          console.error('Problem with the sevice. Please try later : ' + error.message);
        });
    }
    else if (this.Mode == 'Edit') {
      purchasetemplates.ID = this.TemplateDetailForm.get('ID').value;
      this.purchaseTemplateService.UpdatePurchaseTemplateDetail(purchasetemplates).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.toastr.success('PurchaseTemplate Detail details updated successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindTemplateDetailByID();
            this.Mode = 'List';
            this.ResetForm();
          }
          else {
            let ID = this.TemplateDetailForm.get('ID').value;
            this.Cancel();
            this.BindTemplateDetailByID();
            this.Mode = 'List';
          }
          // this.ResetForm();
          // this.BindTemplateDetailByID();
          // this.Mode = 'List';
          // this.submitted = false;
        }
        else {
          alert(resp.message);
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
  }

  //To reset the Form
  ResetForm() {
    this.TemplateDetailForm.patchValue({
      ID: '',
      ProductDescription: '',
      // PurchaseTemplate: '-1',
      ProductType: 'INV',
      Product: '00000000-0000-0000-0000-000000000000',
      Quantity: '0',
      Classification: '-1',
      PurchaseUOM: '00000000-0000-0000-0000-000000000000',
      // PurchaseLineStatus: 'New'
    });
    this.ProductDescription='';
  }

  AddNew(): void {
    this.Mode = 'Add';
    this.read = true;
    this.IsActive = true;
    this.ResetForm();
    this.TemplateDetailForm.enable();
    this.ProductDescription='';
  }

  Cancel(): void {
    this.ResetForm();
    this.submitted = false;
    this.Mode = "List";
    this.ProductDescription='';
  }

  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.read = false;
      this.Mode = 'Edit';
      //this.Edit(event.data.id);
      this.AgEdit(event.data)
    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.id)
    }
  }
  //edit operation
  AgEdit(event) {
    console.log(event);
    debugger;
    this.BindInventoryUOMConversions(event.productID);
    this.TemplateDetailForm.patchValue({
      ID: event.id,
      CompanyID: event.companyID,
      PurchaseTemplate: event.purchaseTemplateID,
      PurchaseLineStatus: event.purchaseLineStatus,
      ProductType: event.productType,
      Product: event.productID,
      ProductDescription: event.productDescription,
      Quantity: event.quantity != null ? event.quantity.trim() : event.quantity,
      PurchaseUOM: event.unitOfMeasure == null ? "00000000-0000-0000-0000-000000000000" : event.unitOfMeasure,
      Classification: event.classificationID == null ? "-1" : event.classificationID ,
    });
    if (event.deleteStatus == 'Active') {
      this.TemplateDetailForm.enable();
      this.IsActive = true;
       this.productTypeStatus(event.productType)
    } else {
      this.TemplateDetailForm.disable();
      this.IsActive = false;
    }
    this.TemplateDetailForm.patchValue({
      ProductDescription: event.productDescription,
      Product: event.productID,
    });
    this.Mode = 'Edit';
    this.ProductDescription = this.TemplateDetailForm.get('ProductDescription').value;
  }

  onDeleteChecked(ID) {
    this.purchaseTemplateService.deletePurchaseTemplateDetailID(ID, 'LBS_PUR_PurchaseTemplateDetail', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        this.BindTemplateDetailByID();
      }

    }, (error) => {
    });
  }

  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-pencil"></i></div>';
    return cellContent
  }
  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }
  ConfirmDialogClose() {
    this.modalRef.hide();
  }

  onProductChange(id, i) {
    debugger;
    let unitCost = 0;
    let des = "";
    let umo = "00000000-0000-0000-0000-000000000000"
    if (id != "-1") {
      this.BindInventoryUOMConversions(id);
      let index = this.inventoryList.findIndex(c => c.id == id);
      if (index >= 0) {
        unitCost = this.inventoryList[index].inventoryDefaultCost;
        des = this.inventoryList[index].productName;
        umo = this.inventoryList[index].unitOfMeasureID;
      }
    }
    this.TemplateDetailForm.patchValue({
      UnitCost: unitCost,
      ProductDescription: des,
      PurchaseUOM: umo
    });
  }
  BindUOM() {
    this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_INV_UnitOfMeasure).subscribe((resp: any) => {
      console.log(resp);
      this.UOMList = resp.data.tabledata;
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindInventoryUOMConversions(InventoryID) {
   /*  if(InventoryID){
    this.UOMList = [];
    this.sysCommonService.getUOMConvertionsByInventryID(InventoryID).subscribe((resp: any) => {
      this.UOMList = resp.data.inventoryunitofmeasure;

    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  } */
  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}

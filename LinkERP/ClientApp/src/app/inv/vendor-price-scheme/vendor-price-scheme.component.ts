import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { VendorPriceSchemeService } from '../services/vendor-price-scheme.service';
import { PurchaseTemplateService } from '../services/purchase-template.service';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { InventoryUOMConversionService } from '../services/inventory-uom-conversion.service';
import { LBSINVVendorPriceScheme } from 'src/app/models/inv/lbs-inv-vendor-price-scheme';
import { InventoryProductPriceService } from '../services/inventory-product-price.service';
import { InventoryService } from '../services/inventory.service';
import { CustomValidators } from 'ngx-custom-validators';
import { EnumExtension } from 'src/app/shared/enums/enum-extension';
import { DealsType } from 'src/app/shared/enums/deals-type.enum';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { InvCommonService } from '../services/inv-common.service';
import { GenricTableIDByName } from 'src/app/shared/enums/enum-generictables';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { SharedFormatterService } from 'src/app/shared/services/shared-formatter.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
@Component({
  selector: 'app-vendor-price-scheme',
  templateUrl: './vendor-price-scheme.component.html',
  styleUrls: ['./vendor-price-scheme.component.css']
})
export class VendorPriceSchemeComponent implements OnInit {
  Mode: any = 'List';
  Submitted: any = false;
  HeaderNames: any;
  CompanyID = localStorage.getItem('CompanyID');
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  Loading: any = false;
  VendorPriceSchemeForm: FormGroup
  BindVendorPriceScheme: any;
  VendorName: any;
  UnitOfMeasure: any;
  UOMName: any;
  Product: any;
  private dealsType;
  IsVendorPrice: boolean;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  AccessTab: string;
  SelectedVendor: any;
  CategoryList: any;
  IsActive: boolean;
  PageSize: any;
  Currentpage: string;
  datePickerConfig: Partial<BsDatepickerConfig>
  selectedVendorPriceSchemeID: any;
  InventoryUnitOfMeasure: any[];
  IsvalidTo: boolean;
  IsReferenced:boolean;
  IsProdustDescription: boolean;

  constructor(
    private toastr: ToastrService,
    private FB: FormBuilder,
    private deleteRecordsService: DeleteRecordsService,
    private vendorPriceSchemeService: VendorPriceSchemeService,
    private commonService: InvCommonService,
    private cryptoAes: CryptoAes,
    private sysCommonService: SysCommonService,
    private sharedFormatterService: SharedFormatterService,
    private modalService: BsModalService

  ) { this.datePickerConfig = Object.assign({}, { dateInputFormat: 'MM-DD-YYYY', showWeekNumbers: false }); }

  ngOnInit() {
    this.AgLoad = false;
    this.IsVendorPrice = true;
    this.IsProdustDescription = true;
    this.dealsType = EnumExtension.getNamesAndValuestring(DealsType);
    this.AccessTab = 'Vendor';
    this.HeaderNames = 'Vendor';
    this.IsdateValid = true;
    this.BindunitOfMeasure();
    this.BindVendorPriceSchemes();
    this.BindVendors();
    this.BindProducts();
    this.CreateForm();
    this.SetPermissions();
    this.ColumnDefs = [
      { headerName: 'Vendor  Name', field: 'name', sortable: true, filter: true, checkboxSelection: false, },
      { headerName: 'Deals Type', field: 'dealsType', sortable: true, filter: true },
      { headerName: 'Valid From', field: 'validFrom', sortable: true, filter: true },
      { headerName: 'Valid To', field: 'validTo', sortable: true, filter: true, },
      { headerName: 'Product Description', field: 'productDescription', sortable: true, filter: true },
      { headerName: ' Quantity ', field: 'quantity_text', sortable: true, filter: true, type: 'numericColumn', },
      { headerName: 'Supplier Unit Price ', field: 'supplierUnitPrice_text', sortable: true, filter: true, type: 'numericColumn', },
      { headerName: 'Status', field: 'status', sortable: true, filter: true },
      { headerName: 'Delete Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }
    ];
    this.PageSize = "50";
    this.Currentpage = "0";
    this.VendorPriceSchemeForm.get('ProductDescription').disable();
  }
  get f() { return this.VendorPriceSchemeForm.controls; }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }

  //To Create a Form
  CreateForm() {
    this.VendorPriceSchemeForm = this.FB.group({
      ID: [''],
      UOM: ['-1', CustomValidators.notEqual('-1')],
      VendorID: ['-1', CustomValidators.notEqual('-1')],
      DealsType: ['Standard'],
      ProductID: ['-1', CustomValidators.notEqual('-1')],
      ProductDescription: ['', Validators.required],
      Quantity: ['', Validators.required],
      SupplierUnitPrice: ['', Validators.required],
      DiscountType: [true],
      DiscountValue: [''],
      FreeDealsQuantity: [''],
      FreeDealsUOM: ['-1'],
      FreeDealsQuantityRedeemed: [''],
      ValidFrom: ['', Validators.required],
      ValidTo: ['', Validators.required],
      Status: ['New']
    });
    this.VendorPriceSchemeForm.get('ProductDescription').disable();
  }
  dateLessThan(from: string, to: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      this.IsdateValid = true;
      if (f.value < t.value) {
        this.IsdateValid = false;
        return {
          dates: "Date from should be less than Date to"
        };
      }
      return {};
    }
  }
  OnProductChange(ID) {
    debugger;
    if (ID != "-1") {
      let index = this.Product.findIndex(c => c.id == ID);
      this.BindInventoryUOMConversions(ID);
      if (index >= 0) {
        this.VendorPriceSchemeForm.patchValue({
          ProductDescription: this.Product[index].productName
        })
      }
    } else {
      this.VendorPriceSchemeForm.patchValue({
        ProductDescription: null
      })
    }
  }
  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr)
    let index = Permissions.findIndex(c => c.menuID == "310");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.VendorPriceSchemeForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.VendorPriceSchemeForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.VendorPriceSchemeForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }
  //To bind the data of all VendorPriceScheme to the Grid.
  BindVendorPriceSchemes() {
    this.Loading = true;
    this.Mode = "List";
    this.AgLoad = false;
    this.vendorPriceSchemeService.getAllVendorScheme().subscribe((resp: any) => {
      this.BindVendorPriceScheme = resp.data.vendorprice;
      debugger;
      resp.data.vendorprice.forEach(element => {
        let today: Date = new Date();
        let endDate = new Date(element.validTo);
        if (!element.deleted) {
          if (today > endDate) {
            element.status = "Closed";
          }
        }
      });
      this.RowData = resp.data.vendorprice;
      this.RowData.forEach(element => {
        let validTo = {'value': element.validTo}
        let validFrom = {'value': element.validFrom}
        
        element.validTo=this.sharedFormatterService.dateTimeFormatter(validTo);
        element.validFrom=this.sharedFormatterService.dateTimeFormatter(validFrom);
      });

  
      this.Loading = false;
      this.AgLoad = true;

    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To bind the vendor names to the dropdown
  BindVendors() {
    this.commonService.getVendor().subscribe((resp: any) => {
      console.log(resp.data.vendors);
      this.VendorName = resp.data.vendors;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To bind the UOM name to the dropdown
  // BindunitOfMeasure() {
  //  this.inventoryUOMConversionService.getInventoryUnitOfMeasureDetails().subscribe((resp: any) => {
  //    this.UOMName = resp.data.inventoryUOM;
  //  }, (error) => {
  //    console.error('Problem with the sevice. Please try later : ' + error);
  //  });
  // }
  //To bind the Product names to the dropdown
  BindProducts() {
    this.commonService.getInventory().subscribe((resp: any) => {
      this.Product = resp.data.productkits;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindInventoryUOMConversions(InventoryID) {
    this.InventoryUnitOfMeasure = [];
    this.sysCommonService.getUOMConvertionsByInventryID(InventoryID).subscribe((resp: any) => {
      this.InventoryUnitOfMeasure = resp.data.inventoryunitofmeasure;
      //this.onUomChange(uom, i);
      this.VendorPriceSchemeForm.patchValue({
        // UOM: this.InventoryUnitOfMeasure[0].uomidFrom,
        FreeDealsUOM: this.InventoryUnitOfMeasure[0].uomidFrom
      })
      console.log(this.InventoryUnitOfMeasure);
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  OnCancel() {
    this.ResetForm();
    this.IsdateValid = true;
    this.Mode = 'Add';
  }

  onSaveold(saveAction) {
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  //To save the Vendor Price Scheme  to database table by calling the API service
  IsdateValid: boolean;
  onSave(saveAction) {

    this.Submitted = true;
    if (this.VendorPriceSchemeForm.invalid) {
      return;
    }
    let d1 = this.VendorPriceSchemeForm.get('ValidFrom').value;
    let d2 = this.VendorPriceSchemeForm.get('ValidTo').value
    /*  if (new Date(d1) < new Date(d2)) {
       this.IsdateValid = false;
       return;
     } */
    if (d1 && d2) {
      let endDate = new Date(d2);
      let fromDate = new Date(d1);
      if (fromDate < endDate) {
        this.IsdateValid = true;
      } else {
        this.IsdateValid = false;
        return;
      }
    }
    this.IsdateValid = true;
    let vendorscheme = new LBSINVVendorPriceScheme();
    vendorscheme.CompanyID = this.CompanyID;
    vendorscheme.VendorID = this.VendorPriceSchemeForm.get('VendorID').value;
    vendorscheme.DealsType = this.VendorPriceSchemeForm.get('DealsType').value;
    vendorscheme.ProductID = this.VendorPriceSchemeForm.get('ProductID').value;
    vendorscheme.ProductDescription = this.VendorPriceSchemeForm.get('ProductDescription').value;
    vendorscheme.Quantity = this.VendorPriceSchemeForm.get('Quantity').value;
    vendorscheme.UOM = this.VendorPriceSchemeForm.get('UOM').value;
    vendorscheme.SupplierUnitPrice = this.VendorPriceSchemeForm.get('SupplierUnitPrice').value;
    vendorscheme.DiscountType = this.VendorPriceSchemeForm.get('DiscountType').value;
    vendorscheme.DiscountValue = this.VendorPriceSchemeForm.get('DiscountValue').value;
    vendorscheme.FreeDealsQuantity = this.VendorPriceSchemeForm.get('FreeDealsQuantity').value;
    vendorscheme.FreeDealsQuantityRedeemed = this.VendorPriceSchemeForm.get('FreeDealsQuantityRedeemed').value;
    vendorscheme.FreeDealsUOM = this.VendorPriceSchemeForm.get('FreeDealsUOM').value;
    vendorscheme.ValidFrom = this.VendorPriceSchemeForm.get('ValidFrom').value;
    vendorscheme.ValidTo = this.VendorPriceSchemeForm.get('ValidTo').value;
    vendorscheme.CreatedBY = localStorage.getItem('LoginID');
    vendorscheme.Status = this.VendorPriceSchemeForm.get('Status').value;
    //If the mode is Add then it will insert data to DB table else update the row by ID
    if (this.Mode == 'Add') {
      this.vendorPriceSchemeService.addvendorscheme(vendorscheme).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.toastr.success(' vendor scheme added successfully');
          if (saveAction == 'Close') {
            this.Cancel();
            this.BindVendorPriceSchemes();
            this.Mode = 'List';
            this.ResetForm();
          }
          else {
            this.Edit(resp.data.id);
            this.BindVendorPriceSchemes();
            this.Mode = 'Edit';

          }
          // this.BindVendorPriceSchemes();
          // this.Mode = 'List';
          this.Loading = false;
          // this.ResetForm();
        }
        else {
          this.toastr.error(resp.message);
          this.Loading = false;
        }
      }, (error) => {
      });
    }
    else if (this.Mode == 'Edit') {
      vendorscheme.ID = this.VendorPriceSchemeForm.get('ID').value;
      this.vendorPriceSchemeService.updatevendorscheme(vendorscheme).subscribe((resp: any) => {
        if (resp.isSuccess) {

          this.toastr.success('Vendor Scheme updated successfully')
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
            this.ResetForm();
            this.BindVendorPriceSchemes();
          }
          else {
            this.Edit(this.VendorPriceSchemeForm.get('ID').value)

          }
          // this.BindVendorPriceSchemes();
          // this.Mode = 'List';
          this.Loading = false;
          this.ResetForm();
        }
        else {
          alert(resp.message);
        }

      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
    this.Loading = false;
  }

  //To bind the data to the grid while editing
  BindVendorDetails(event) {
    this.VendorPriceSchemeForm.patchValue({
      ID: event.id,
      UOM: event.uom,
      VendorID: event.vendorID,
      DealsType: event.dealsType,
      ProductID: event.productID,
      ProductDescription: event.productDescription,
      Quantity: event.quantity_text,
      SupplierUnitPrice: event.supplierUnitPrice_text,
      DiscountType: event.discountType,
      DiscountValue: event.discountValue_text,
      FreeDealsQuantity: event.freeDealsQuantity_text,
      FreeDealsQuantityRedeemed: event.freeDealsQuantityRedeemed,
      FreeDealsUOM: event.freeDealsUOM,
      ValidFrom: event.validFrom,
      ValidTo: event.validTo
    })
    if (!event.deleted) {
      this.VendorPriceSchemeForm.enable();
      this.IsActive = true;
    } else {
      this.VendorPriceSchemeForm.disable();
      this.IsActive = false;
    }
  }
  //To Add new Vendor Price Scheme
  AddNew() {
    this.ResetForm();

    this.VendorPriceSchemeForm.enable();
    this.VendorPriceSchemeForm.get('ProductDescription').disable();
    this.dealtypestatus('Standard');
    this.IsdateValid = true;
    this.Mode = 'Add';
    this.IsActive = true;
    this.IsvalidTo = true;
    this.IsReferenced=true;
  }
  ResetForm() {
    this.VendorPriceSchemeForm.patchValue({
      ID: '',
      UOM: '-1',
      VendorID: '-1',
      DealsType: 'Standard',
      ProductID: '-1',
      ProductDescription: '',
      Quantity: '',
      SupplierUnitPrice: '',
      DiscountType: 'true',
      DiscountValue: '',
      FreeDealsQuantity: '',
      FreeDealsQuantityRedeemed: '',
      FreeDealsUOM: '-1',
      ValidFrom: '',
      ValidTo: '',
      Status: 'New'
    });
    this.VendorPriceSchemeForm.markAsUntouched();
    this.VendorPriceSchemeForm.markAsPristine();
    this.Submitted = false;
    this.VendorPriceSchemeForm.get('ProductDescription').disable();
  }
  //Cancel the Add/Edit
  Cancel() {
    //this.Mode = 'List';
    // let VendorPriceScheme = {
    //   uom: ['-1'],
    //   vendorID: ['-1'],
    //   dealsType: ['SD'],
    //   productID: ['-1'],
    //   productDescription:[''],
    //   quantity:[''],
    //   supplierUnitPrice:['']
    // };
    this.IsdateValid = true;
    this.ResetForm();
    this.BindVendorPriceSchemes();
    this.Mode = 'List';
  }
  // onProductChange(name:any){
  //   this.f.ProductDescription.setValue(name);
  // }
  //Delete the record
  onDeleteChecked(ID) {
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_INV_VendorPriceScheme', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.BindVendorPriceSchemes();
      this.Mode = 'List';
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindunitOfMeasure() {
    this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_INV_UnitOfMeasure).subscribe((resp: any) => {
      this.CategoryList = resp.data.tabledata;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  OnActionClick(event: any) {

    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.IsdateValid = true;
      this.SelectedVendor = event.data.vendorID;

      this.Edit(event.data.id);
    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.id)
    }
  }

  Edit(ID): void {
    this.Mode = 'Edit';
    this.selectedVendorPriceSchemeID = ID;
    this.BindVendorpriceById(ID);

  }
  BindVendorpriceById(ID) {
    this.VendorPriceSchemeForm.get('ProductDescription').disable();
    this.vendorPriceSchemeService.getvendorschemeByID(ID).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        let event: any = new LBSINVVendorPriceScheme();
        event = resp.data.vendorprice;
        this.SelectedVendor = event.vendorID;
        this.selectedVendorPriceSchemeID = ID;
        this.VendorPriceSchemeForm.patchValue({
          ID: event.id,
          UOM: event.uom,
          VendorID: event.vendorID,
          DealsType: event.dealsType,
          ProductID: event.productID,
          ProductDescription: event.productDescription,
          Quantity: event.quantity_text,
          SupplierUnitPrice: event.supplierUnitPrice_text,
          DiscountType: event.discountType,
          DiscountValue: event.discountValue_text,
          FreeDealsQuantity: event.freeDealsQuantity_text,
          FreeDealsQuantityRedeemed: event.freeDealsQuantityRedeemed != null ? event.freeDealsQuantityRedeemed.toString().indexOf(".") !== -1 ? event.freeDealsQuantityRedeemed : event.freeDealsQuantityRedeemed + ".00" : "0.00",
          FreeDealsUOM: event.freeDealsUOM,
          ValidFrom: event.validFrom,
          ValidTo: event.validTo,
          Status: event.status
        });
        this.BindInventoryUOMConversions(event.productID);
        let d1 = this.VendorPriceSchemeForm.get('ValidFrom').value;
        let d2 = this.VendorPriceSchemeForm.get('ValidTo').value;
        let today: Date = new Date();
        let endDate = new Date(d2);
        debugger;
        this.IsActive = true;
        this.IsvalidTo = true;
        this.IsReferenced=true;
        if (!event.deleted) {
          this.VendorPriceSchemeForm.enable();
          if (today > endDate) {
            this.VendorPriceSchemeForm.disable();
            this.IsvalidTo = false;
            this.changeStatus();
          }
          else if (event.status=='Active') {
            this.VendorPriceSchemeForm.disable();
            this.IsReferenced  = false;
            //this.changeStatus();
          } else {
            this.VendorPriceSchemeForm.enable();
            this.IsvalidTo = true;
            this.dealtypestatus(event.dealsType);
          }
        } else {
          this.VendorPriceSchemeForm.disable();
          this.IsActive = false;
        }
      }
      this.VendorPriceSchemeForm.get('ProductDescription').disable();
    },
      (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
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
  dealtypestatus(ID) {
    if (ID == "Standard") {
      this.VendorPriceSchemeForm.get('FreeDealsUOM').disable();
      this.VendorPriceSchemeForm.get('FreeDealsQuantity').disable();
    }
    else {
      this.IsVendorPrice = false;
      this.VendorPriceSchemeForm.get('FreeDealsUOM').enable();
      this.VendorPriceSchemeForm.get('FreeDealsQuantity').enable();
    }
  }
  OnActionChange($event) {
    console.log("Done");
  }
  changeStatus() {
    this.VendorPriceSchemeForm.patchValue({
      Status: 'Closed'
    })
  }

  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrganisationMaintenanceService } from 'src/app/sys/services/organisation-maintenance.service';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { ToastrService } from 'ngx-toastr';
import { LBSSYSCompany } from 'src/app/models/sys/lbs-sys-company';
import { InventoryService } from '../services/inventory.service';
import { InvCommonService } from '../services/inv-common.service';
import { LBSINVInventory } from 'src/app/models/inv/lbs-inv-inventory';
import { TaxCodeService } from 'src/app/sys/services/tax-code.service';
import { PriceGroupsService } from '../services/price-groups.service';
import { ProductStyleMatrixService } from '../services/product-style-matrix.service';
import { GenricTableIDByName } from 'src/app/shared/enums/enum-generictables';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { CustomValidators } from 'ngx-custom-validators';
import { INVDefaultCost } from 'src/app/shared/enums/inv-default-cost';
import { EnumExtension } from 'src/app/shared/enums/enum-extension';
import { INVProductStatus } from 'src/app/shared/enums/inv-product-status';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { InventoryDetailComponent } from 'src/app/inv/inventory/inventory-detail/inventory-detail.component'
import { ConfigurationService } from 'src/app/sys/services/configuration.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  @ViewChild(InventoryDetailComponent) InvDetailsComponent: InventoryDetailComponent;
  Mode: any = 'List';

  //Submitted: any = false;
  Companies: any[] = [];
  Loading: any = false;
  inventories: any[] = [];
  BindTableDetails: any[] = [];
  PriceList: any[] = [];
  TaxcodeList: any[] = [];
  StockList: any[] = [];
  ProductStyleMatrixlist: any[] = [];
  BindCompany: any;
  HeaderNames: any;
  CompanyId = localStorage.getItem('CompanyID');
  TableID = localStorage.getItem('TableID');
  ProductStatus: any;
  makeProductStyleMatrixDisabled: boolean;
  // TaxID = localStorage.getItem('TaxID');
  InventoryForm: FormGroup;
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  AccessTab: string;
  SelectedInventryID: any;
  ProductStyleMatrix; any;
  CategoryList: any;
  SubCategoryList: any;
  UOMList: any;
  submitted: boolean;
  IsInventoryKit: boolean;
  IsProductPrice: boolean;
  IsWareHousePrice: boolean;
  //_INVDefaultCost = INVDefaultCost;
  @ViewChild('sectionNeedToScroll') sectionNeedToScroll: ElementRef;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  IsActive: boolean;
  BindInventoryPrescriptionPrice: any;
  private invdefaultCostList;//= EnumExtension.getNamesAndValues(INVDefaultCost);

  private invproductStatusList //= EnumExtension.getNamesAndValues(INVProductStatus);
  test: boolean;
  makeSerialisedProductDisabled: any;
  PageSize: any;
  Currentpage: string;
  SearchKeyData: any;
  ProductGroup: any;
  ProductGroup2: any;
  ProductGroup3: any;
  WarrantyFrequency: any;
  RowIndex: any;
  IsEdit: boolean;
  productStatus: string;
  selectedUOM: any;
  availbleStock: any = 0;
  BulkFlagCaption: any;
  stockCount: any = 0;
  CanmakeProductActive: any;
  constructor(private toastr: ToastrService,
    private inventoryService: InventoryService,
    private sysCommonService: SysCommonService,
    private invCommonService: InvCommonService,
    private priceService: PriceGroupsService,
    private taxservice: TaxCodeService,
    private productstyle: ProductStyleMatrixService,
    private deleteRecordsService: DeleteRecordsService,
    private cryptoAes: CryptoAes,
    private priceservice: PriceGroupsService,
    private FB: FormBuilder,
    private configuration: ConfigurationService) { }

  ngOnInit() {
    this.invproductStatusList = EnumExtension.getNamesAndValuestring(INVProductStatus);
    this.invdefaultCostList = EnumExtension.getNamesAndValues(INVDefaultCost);
    this.submitted = false;
    this.AgLoad = false;
    this.HeaderNames = "Inventory";
    this.AccessTab = "Inventory";
    this.RowIndex = null;
    this.GetProductStyleMatrix();
    this.BindGetTaxCode();
    this.BindCategory();
    this.BindPriceGroup();
    this.BindUOM();
    this.BindStock();
    this.BindGenericNames();
    this.BindWarrantyFrequency();
    this.BindProductGroup();
    this.BindProductGroup2();
    this.BindProductGroup3();
    this.AllConfigurationByModuleID();
    //this.BindTableData(this.TableID);
    this.CreateForm();
    this.SetPermissions();
    this.ColumnDefs = [
      { headerName: 'Code', field: 'productCode', sortable: true, filter: true, checkboxSelection: false, width: 95, },
      { headerName: 'Name', field: 'productName', sortable: true, filter: true, width: 130 },
      { headerName: 'Category ', field: 'categoryName', sortable: true, filter: true, width: 130 },
      { headerName: 'Sub Category ', field: 'subCategoryName', sortable: true, filter: true, width: 130 },
      { headerName: 'UOM', field: 'uomName', sortable: true, filter: true, width: 130 },
      { headerName: 'Product Status', field: 'productStatus_text', sortable: true, filter: true, width: 150 },
      { headerName: 'Allow Purchase', field: 'allowPurchase_text', sortable: true, filter: true, width: 150 },
      { headerName: 'Use WareHouse Price', field: 'useWareHousePrice_text', sortable: true, filter: true, width: 150 },
      { headerName: 'Serialised', field: 'serialisedProduct_text', sortable: true, filter: true, width: 130 },
      { headerName: 'Bulk Item', field: 'bulkItem_text', sortable: true, filter: true, width: 130 },
      { headerName: 'Allow Discount', field: 'allowDiscount_text', sortable: true, filter: true, width: 150 },
      { headerName: 'Custom Kit', field: 'customKit_text', sortable: true, filter: true, width: 130 },
      { headerName: 'Web Sellable', field: 'websellable_text', sortable: true, filter: true, width: 130 },
      // { headerName: 'Deleted', field: 'deleted', sortable: true, filter: true, width: 95 },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },

      { headerName: '', field: 'Edit', type: 'EditAction', hide: false, },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: !this.delete_Access }
    ];
    this.PageSize = "50";
    this.Currentpage = "0";
    this.BindInventories();
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
    let Permissions = JSON.parse(Permissionsstr)
    let index = Permissions.findIndex(c => c.menuID == "201");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.InventoryForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.InventoryForm.disable();
          this.InventoryForm.get('SearchKey').enable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.InventoryForm.disable();
      this.InventoryForm.get('SearchKey').enable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

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
  BindStock() {
    this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_INV_StockTakeCycle).subscribe((resp: any) => {
      console.log(resp);
      this.StockList = resp.data.tabledata;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindProductStyleMatrix() {
    this.invCommonService.getProductStyleMatrix().subscribe((resp: any) => {
      console.log(resp);
      this.ProductStyleMatrixlist = resp.data.productmatrix;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }


  BindGetTaxCode() {
    this.priceservice.getalltaxcode().subscribe((resp: any) => {
      console.log(resp);
      this.TaxcodeList = resp.data.taxcode;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindUOM() {
    this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_INV_UnitOfMeasure).subscribe((resp: any) => {
      console.log(resp);
      this.UOMList = resp.data.tabledata;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindWarrantyFrequency() {
    this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_INV_WarrantyFrequency).subscribe((resp: any) => {
      console.log(resp);
      this.WarrantyFrequency = resp.data.tabledata;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  BindProductGroup() {
    this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_INV_ProductGroup).subscribe((resp: any) => {
      console.log(resp);
      this.ProductGroup = resp.data.tabledata;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  BindProductGroup2() {
    this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_INV_ProductGroup2).subscribe((resp: any) => {
      console.log(resp);
      this.ProductGroup2 = resp.data.tabledata;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  BindProductGroup3() {
    this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_INV_ProductGroup3).subscribe((resp: any) => {
      console.log(resp);
      this.ProductGroup3 = resp.data.tabledata;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }


  BindPriceGroup() {
    this.invCommonService.getActivePriceGroups().subscribe((resp: any) => {
      console.log(resp);
      this.PriceList = resp.data.pricegroups;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  get f() {
    if (this.InventoryForm.invalid) {
      this.submitted = true;
    }
    return this.InventoryForm.controls;

  }
  //To create the Inventory Form Controls.
  CreateForm() {
    this.InventoryForm = this.FB.group({
      ID: [''],
      ProductCode: [''],
      ProductName: ['', Validators.required],
      CategoryID: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')],
      SubCategoryID: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')],
      UnitofMeasure: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')],
      InventoryDefaultCost: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')],
      Tax: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')],
      DecimalPlaces: ['0'],
      Weight: [''],
      Height: [''],
      Width: [''],
      Length: [''],
      PriceGroup: ['00000000-0000-0000-0000-000000000000'],
      StockTakeCycle: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')],
      ProductStatus: ['00000000-0000-0000-0000-000000000000', CustomValidators.notEqual('00000000-0000-0000-0000-000000000000')],
      AllowPurchase: [false],
      MinimumProfitPercentage: [''],
      ProductStyleMatrixEnabled: [false],
      ProductStyleMatrixColumn: ['00000000-0000-0000-0000-000000000000'],
      ProductStyleMatrixRow: ['00000000-0000-0000-0000-000000000000'],
      UseWareHousePrice: [false],
      SerialisedProduct: [false],
      BulkItem: [false],
      AllowDiscount: [false],
      CustomKit: [false],
      Websellable: [false],
      GiftVoucher: [false],
      UseExpiryDates: [false],
      PrescriptionInstructions: [''],
      PrescriptionSpecialInstructions: [''],
      PrescriptionCareInstructions: [''],
      PrescriptionWarning: [''],
      ProductGroup: ['00000000-0000-0000-0000-000000000000'],
      ProductGroup2: ['00000000-0000-0000-0000-000000000000'],
      ProductGroup3: ['00000000-0000-0000-0000-000000000000'],
      WarrantyPeriod: [''],
      WarrantyFrequency: ['00000000-0000-0000-0000-000000000000'],
      WarrantyTerms: [''],
      SearchKey: null
    });
    this.InventoryForm.patchValue(
      {
        AllowDiscount: false,
        UseExpiryDates: false
      }
    );
  }
  GetProductStyleMatrix() {
    this.invCommonService.getProductStyleMatrix().subscribe((resp: any) => {
      console.log(resp.data);
      this.ProductStyleMatrix = resp.data.productmatrix;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      //  console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  BindInventories() {
    this.AgLoad = false;
    this.Mode = "List";
    this.inventoryService.getInventories().subscribe((resp: any) => {
      this.RowData = resp.data.inventory;
      console.log(this.RowData)
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  GetProductStock(productID, productStatus) {
    this.inventoryService.GetProductStockCount(productID).subscribe((resp: any) => {
      this.stockCount = resp.data.productStockCount;
debugger;
      if (this.stockCount != null && this.stockCount!="0") {
        this.InventoryForm.get('UnitofMeasure').disable();
      }
      // if (this.stockCount=="0") {
      //   this.InventoryForm.get('UnitofMeasure').enable();
      // }
      else{
        this.InventoryForm.get('UnitofMeasure').enable(); 
      }
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  BindCompanies() {
    this.sysCommonService.getCompanies().subscribe((resp: any) => {
      this.BindCompany = resp.data.companies;
      this.Loading = false;
    }, (error) => {
    });
  }

  BindTableData(TableID) {
    this.sysCommonService.getLookupByID(TableID).subscribe((resp: any) => {
      this.BindTableDetails = resp.data.tabledata;
      console.log(this.BindTableDetails);
      this.Loading = false;
    }, (error) => {
    });
  }

  //Add new
  AddNew() {
    this.CreateForm();
    this.InventoryForm.patchValue({
      SearchKey: ['']
    });
    this.Mode = 'Add';
    this.InventoryForm.enable();
    this.IsActive = true;
    this.InventoryForm.get('ProductStyleMatrixRow').disable();
    this.InventoryForm.get('ProductStyleMatrixColumn').disable();
    this.sectionNeedToScroll.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    // this.InventoryForm.patchValue(
    //   {
    //     AllowDiscount: false
    //   }
    // );
    this.InventoryForm.get('AllowDiscount').enable();
    this.InventoryForm.get('UseExpiryDates').disable();
  }

  //Cancel the Add/Edit
  Cancel() {
    this.SubCategoryList = [];
    this.Mode = 'List';
    this.submitted = false;
    let Inventory = {
      categoryID: "00000000-0000-0000-0000-000000000000",
      priceGroupID: "00000000-0000-0000-0000-000000000000",
      productStyleMatrixColumn: "00000000-0000-0000-0000-000000000000",
      productStyleMatrixRow: "00000000-0000-0000-0000-000000000000",
      stocktakeCycleID: "00000000-0000-0000-0000-000000000000",
      subCategoryID: "00000000-0000-0000-0000-000000000000",
      unitOfMeasureID: "00000000-0000-0000-0000-000000000000",
      productStatus: "00000000-0000-0000-0000-000000000000",
      inventoryDefaultCost: "00000000-0000-0000-0000-000000000000",
      decimalPlaces: '0',
      productGroup: "00000000-0000-0000-0000-000000000000",
      productGroup2: "00000000-0000-0000-0000-000000000000",
      productGroup3: "00000000-0000-0000-0000-000000000000",
      warrantyFrequency: "00000000-0000-0000-0000-000000000000",
      taxID: "00000000-0000-0000-0000-000000000000"
    };
    //this.BindDetails(Inventory);
    this.BindInventories();
    this.InventoryForm.get('SearchKey').enable();
    this.InventoryForm.get('ProductStyleMatrixRow').enable();
    this.InventoryForm.get('ProductStyleMatrixColumn').enable();
  }

  //Delete the record
  onDeleteChecked(ID) {
    debugger;
    this.Loading = true;
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_INV_Inventory', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      // this.toastr.success('Inventory deleted successfully')
      this.Mode = 'List';
      this.BindInventories();
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  DeleteInventoryByID(ID) {
    debugger;
    this.Loading = true;
    this.inventoryService.deleteInventory(ID).subscribe((resp: any) => {
      // this.toastr.success('Inventory deleted successfully')
      this.Mode = 'List';
      this.BindInventories();
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  DeleteInventory
  OnActionClick(event: any) {
    debugger;
    this.InventoryForm.patchValue({
      SearchKey: ['']
    });
    var colId = event.column.getId();
    if (colId == 'Edit') {
      console.log("Edit");
      // window.scroll(100,200);
      this.RowIndex = event.rowIndex
      this.sectionNeedToScroll.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      this.Mode = 'Edit';
      this.BindDetails(event.data);

      this.onCategoryChange(event.data.categoryID)
    } else if (colId == 'Delete') {
      debugger;
      this.inventoryService.AvailableStocktoDelete(event.data.id).subscribe((resp: any) => {
        this.availbleStock = resp.data.availableStock;
        if (this.availbleStock != null) {
          this.toastr.warning('This Product is in Use, cannot be marked as Inactive!');
        }

        else {
          debugger;
          if (event.data.deleted) {
            if (this.CanmakeProductActive == "N" || this.CanmakeProductActive == "n") {
              this.toastr.warning("Users with security can make the products active.")
              return;
            }
            else {
              //this.DeleteInventoryByID(event.data.id);
              this.onDeleteChecked(event.data.id);
            }

          }
          else {
            this.DeleteInventoryByID(event.data.id);
            //this.onDeleteChecked(event.data.id);
          }
        }
      }, (error) => {
        this.toastr.error(error);
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }

  }

  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="bi fa fa-pencil"></i></div>';
    return cellContent
  }
  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }
  InventoryTabSelected() {
    this.AccessTab = 'Inventory';
    this.CheckProductStatus();
  }
  BindDetails(event) {
    debugger
    console.log(event);
    this.SelectedInventryID = event.id;
    //this.IsInventoryKit = event.customKit;
    this.IsProductPrice = !event.useWareHousePrice;
    this.IsWareHousePrice = event.useWareHousePrice;
    this.selectedUOM = event.unitOfMeasureID;

    this.InventoryForm.patchValue({
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
      UseExpiryDates: event.useExpiryDates,
      PrescriptionInstructions: event.prescriptionSpecialInstructions,
      PrescriptionSpecialInstructions: event.prescriptionInstructions,
      PrescriptionCareInstructions: event.prescriptionCareInstructions,
      PrescriptionWarning: event.prescriptionWarning,
      DecimalPlaces: event.decimalPlaces,
      ProductGroup: event.productGroup,
      ProductGroup2: event.productGroup2,
      ProductGroup3: event.productGroup3,
      WarrantyPeriod: event.warrantyPeriod,
      WarrantyFrequency: event.warrantyFrequency,
      WarrantyTerms: event.warrantyTerms,
    });
    if (event.productStyleMatrixColumn == null) {
      this.InventoryForm.patchValue({ ProductStyleMatrixColumn: '00000000-0000-0000-0000-000000000000' });
    }
    if (event.productStyleMatrixRow == null) {

      this.InventoryForm.patchValue({ ProductStyleMatrixRow: '00000000-0000-0000-0000-000000000000' });
    }

    this.SelectedInventryID = event.id;
    this.productStatus = event.productStatus;
    // if (this.productStatus != 'F')
    //   this.GetProductStock(this.SelectedInventryID, event.productStatus);
    if (event.productStatus == 'C') {
      this.IsInventoryKit = true;
      this.checkStatusEnableForComponent(event.id);
    } else if (event.productStatus == 'F') {
      this.IsInventoryKit = false;
      this.checkStatusEnable(event.id);
      this.GetProductStock(this.SelectedInventryID, event.productStatus);
    } else {
      this.IsInventoryKit = false;
    }

    if (event.deleteStatus == 'Active') {
      this.InventoryForm.enable();
      this.IsActive = true;
    } else {
      this.InventoryForm.disable();
      this.IsActive = false;
    }
    // this.switchForProductStyleMatrix();
    /* this.switchForSerialisedProduct(); */
    if (this.InventoryForm.get('ProductStyleMatrixEnabled').value) {
      this.InventoryForm.patchValue({ SerialisedProduct: false });
      this.InventoryForm.get('ProductStyleMatrixRow').enable();
      this.InventoryForm.get('ProductStyleMatrixColumn').enable();
      this.InventoryForm.get('UseExpiryDates').enable();
      this.InventoryForm.get('GiftVoucher').disable();
      this.InventoryForm.patchValue({ GiftVoucher: false });
      this.InventoryForm.patchValue({ UseExpiryDates: false });

    }
    else {
      this.InventoryForm.get('ProductStyleMatrixRow').disable();
      this.InventoryForm.get('ProductStyleMatrixColumn').disable();
    }
    if (this.InventoryForm.get('SerialisedProduct').value) {
      this.InventoryForm.patchValue({ ProductStyleMatrixEnabled: false });
      this.InventoryForm.get('ProductStyleMatrixRow').disable();
      this.InventoryForm.get('ProductStyleMatrixColumn').disable();
      this.InventoryForm.get('UseExpiryDates').disable();
      this.InventoryForm.patchValue({ ProductStyleMatrixRow: '00000000-0000-0000-0000-000000000000' });
      this.InventoryForm.patchValue({ ProductStyleMatrixColumn: '00000000-0000-0000-0000-000000000000' });
      this.InventoryForm.patchValue({ UseExpiryDates: false });
    }

    this.onProductStatusChange(event.productStatus);
    this.AccessTab = "Inventory";
    this.IsEdit = false;
    this.Mode = 'Edit';
    this.IsEdit = true;
  }
  CheckProductStatus() {
    if (this.productStatus == 'C') {
      this.checkStatusEnableForComponent(this.SelectedInventryID);
    } else if (this.productStatus == 'F') {
      this.checkStatusEnable(this.SelectedInventryID);
    }
  }
  checkStatusEnableForComponent(Id) {
    this.inventoryService.checkStatusEnableForComponent(Id).subscribe((res: any) => {
      console.log(res);
      if (res.data.productStatus == 'Disable') {
        this.InventoryForm.get('ProductStatus').disable();
      } else {
        this.InventoryForm.get('ProductStatus').enable();
      }
    })
  }

  checkStatusEnable(Id) {
    this.inventoryService.checkStatusForActive(Id).subscribe((res: any) => {
      console.log(res);
      if (res.data.productStatus == 'Disable') {
        this.InventoryForm.get('ProductStatus').disable();
      } else {
        this.InventoryForm.get('ProductStatus').enable();
      }
    })
  }

  onModeChange(mode: any) {
    // alert(mode);
    this.Mode = mode;
  }
  OnCancel() {
    this.Cancel();
    this.Mode = 'Add';
  }
  onSavetest() {
    this.submitted = true;
    if (this.InventoryForm.valid) {

    }
  }
  onSaveold(saveAction) {
    this.confirmation.ConfirmationPopupSave('Are you sure to save record?', saveAction);
  }
  IsStyleMatrixColumn: boolean;
  IsStyleMatrixRow: boolean;
  onSave(saveAction) {
    debugger;
    this.submitted = true;
    this.IsStyleMatrixColumn = false;
    this.IsStyleMatrixRow = false;
    if (this.InventoryForm.get('ProductStyleMatrixEnabled').value == '1') {
      if (this.InventoryForm.get('ProductStyleMatrixColumn').value == '00000000-0000-0000-0000-000000000000') {
        this.IsStyleMatrixColumn = true;

      } else {
        this.IsStyleMatrixColumn = false;
      }
      if (this.InventoryForm.get('ProductStyleMatrixRow').value == '00000000-0000-0000-0000-000000000000') {
        this.IsStyleMatrixRow = true;

      } else {
        this.IsStyleMatrixRow = false;
      }

    }
    if (this.IsStyleMatrixColumn || this.IsStyleMatrixRow) {
      return;
    }
    if (this.InventoryForm.invalid) {
      return;
    }
    this.Loading = true;
    let Inventory = new LBSINVInventory();
    Inventory.CompanyID = this.CompanyId;
    Inventory.CreatedBY = localStorage.getItem('LoginID');
    Inventory.ProductCode = this.InventoryForm.get('ProductCode').value;
    Inventory.ProductName = this.InventoryForm.get('ProductName').value;
    Inventory.CategoryID = this.InventoryForm.get('CategoryID').value;
    Inventory.SubCategoryID = this.InventoryForm.get('SubCategoryID').value;
    Inventory.UnitOfMeasureID = this.InventoryForm.get('UnitofMeasure').value;
    Inventory.InventoryDefaultCost = this.InventoryForm.get('InventoryDefaultCost').value;
    Inventory.TaxID = this.InventoryForm.get('Tax').value;
    Inventory.DecimalPlaces = this.InventoryForm.get('DecimalPlaces').value;
    Inventory.Weight = this.InventoryForm.get('Weight').value;
    Inventory.Height = this.InventoryForm.get('Height').value;
    Inventory.Width = this.InventoryForm.get('Width').value;
    Inventory.Length = this.InventoryForm.get('Length').value;
    Inventory.PriceGroupID = this.InventoryForm.get('PriceGroup').value;
    // Inventory.StocktakeCycleID = this.InventoryForm.get('StockTakeCycle').value;
    Inventory.ProductStatus = this.InventoryForm.get('ProductStatus').value;
    Inventory.AllowPurchase = this.InventoryForm.get('AllowPurchase').value;
    Inventory.MinimumProfitPercentage = this.InventoryForm.get('MinimumProfitPercentage').value;
    Inventory.ProductStyleMatrixEnabled = this.InventoryForm.get('ProductStyleMatrixEnabled').value;
    // Inventory.ProductStyleMatrixColumn = this.InventoryForm.get('ProductStyleMatrixColumn').value;
    // Inventory.ProductStyleMatrixRow = this.InventoryForm.get('ProductStyleMatrixRow').value;
    Inventory.UseWareHousePrice = this.InventoryForm.get('UseWareHousePrice').value;
    this.IsWareHousePrice = this.InventoryForm.get('UseWareHousePrice').value;
    Inventory.SerialisedProduct = this.InventoryForm.get('SerialisedProduct').value;
    Inventory.BulkItem = this.InventoryForm.get('BulkItem').value;
    Inventory.AllowDiscount = this.InventoryForm.get('AllowDiscount').value;
    Inventory.CustomKit = this.InventoryForm.get('CustomKit').value;
    Inventory.Websellable = this.InventoryForm.get('Websellable').value;
    Inventory.UseExpiryDates = this.InventoryForm.get('UseExpiryDates').value;
    Inventory.PrescriptionInstructions = this.InventoryForm.get('PrescriptionInstructions').value;
    Inventory.PrescriptionSpecialInstructions = this.InventoryForm.get('PrescriptionSpecialInstructions').value;
    Inventory.PrescriptionCareInstructions = this.InventoryForm.get('PrescriptionCareInstructions').value;
    Inventory.PrescriptionWarning = this.InventoryForm.get('PrescriptionWarning').value;
    Inventory.ProductGroup = this.InventoryForm.get('ProductGroup').value;
    Inventory.ProductGroup2 = this.InventoryForm.get('ProductGroup2').value;
    Inventory.ProductGroup3 = this.InventoryForm.get('ProductGroup3').value;
    Inventory.WarrantyPeriod = this.InventoryForm.get('WarrantyPeriod').value;
    Inventory.WarrantyFrequency = this.InventoryForm.get('WarrantyFrequency').value;
    Inventory.WarrantyTerms = this.InventoryForm.get('WarrantyTerms').value;
    Inventory.GiftVoucher = this.InventoryForm.get('GiftVoucher').value;
    if (this.InventoryForm.get('ProductStyleMatrixColumn').value == '00000000-0000-0000-0000-000000000000') {
      Inventory.ProductStyleMatrixColumn = null;

    } else {
      Inventory.ProductStyleMatrixColumn = this.InventoryForm.get('ProductStyleMatrixColumn').value;
    }
    if (this.InventoryForm.get('ProductStyleMatrixRow').value == '00000000-0000-0000-0000-000000000000') {
      Inventory.ProductStyleMatrixRow = null;

    } else {
      Inventory.ProductStyleMatrixRow = this.InventoryForm.get('ProductStyleMatrixRow').value;
    }

    if (this.InventoryForm.get('StockTakeCycle').value == '00000000-0000-0000-0000-000000000000') {
      Inventory.StocktakeCycleID = null;

    } else {
      Inventory.StocktakeCycleID = this.InventoryForm.get('StockTakeCycle').value;
    }
    //console.log(Inventory);
    //If the mode Add will insert data to DB table else update the row by ID
    if (this.Mode == 'Add') {

      
      this.inventoryService.addInventory(Inventory).subscribe((resp: any) => {
        this.submitted = false;
        if (resp.isSuccess) {
          this.toastr.success('Inventory details added successfully');
          // alert(resp.message);
          //this.ResetForm();
          /* this.BindInventories();
          this.Mode = 'List';
          this.Loading = false; */
          // this.Mode = 'Edit';
          this.Loading = false;
          if (saveAction == 'Close') {
            this.Cancel();
            this.Mode = 'List';
          } else {
            this.GetInventoryByID(resp.data.id);
          }
        }
        else {

          this.toastr.warning(resp.message);
        }
      }, (error) => {
        // console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    else if (this.Mode == 'Edit') {
      this.Loading = true;
      Inventory.ID = this.InventoryForm.get('ID').value;
      this.inventoryService.updateInventory(Inventory).subscribe((resp: any) => {
        this.submitted = false;
        if (resp.isSuccess) {
          this.toastr.success('Inventories updated successfully')
          {
            this.Loading = false;
            //this.ResetForm();
            this.InvDetailsComponent.ngOnInit();
            this.Mode = 'Edit';
            // ;
            if (saveAction == 'Close') {
              this.Cancel();
              this.Mode = 'List';
            } else {
              this.GetInventoryByID(this.InventoryForm.get('ID').value);
            }
            // this.Mode = 'List';
          }
        }
        else {
          this.toastr.warning(resp.message);
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
  }

  onCategoryChanges(ID) {
    this.SubCategoryList = [];
    if (ID != "00000000-0000-0000-0000-000000000000") {
      this.sysCommonService.getChildLookup(GenricTableIDByName.LBS_INV_Categories, ID).subscribe((resp: any) => {
        console.log(resp);
        this.SubCategoryList = resp.data.tabledata;
        this.InventoryForm.patchValue({
          SubCategoryID: '00000000-0000-0000-0000-000000000000'
        });
      }, (error) => {
        this.Loading = false;
        this.toastr.error(error);
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    }
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
  onChangeMatrixRow(ID) {
    if (ID == "00000000-0000-0000-0000-000000000000") {
      this.IsStyleMatrixRow = true;
    }
    else {
      this.IsStyleMatrixRow = false;
    }
  }
  onChangeMatrixColumn(ID) {
    if (ID == "00000000-0000-0000-0000-000000000000") {
      this.IsStyleMatrixColumn = true;
    }
    else {
      this.IsStyleMatrixColumn = false;
    }
  }
  BindGenericNames() {
    this.invCommonService.getGenericNames().subscribe((resp: any) => {
      this.ProductStatus = resp.data.genericnames;
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  switchForSerialisedProduct() {
    debugger;
    if (this.InventoryForm.get('SerialisedProduct').value) {
      this.InventoryForm.patchValue({ ProductStyleMatrixEnabled: false });
      this.InventoryForm.get('ProductStyleMatrixRow').disable();
      this.InventoryForm.get('ProductStyleMatrixColumn').disable();
      this.InventoryForm.get('UseExpiryDates').disable();
      this.InventoryForm.get('GiftVoucher').enable();
      this.InventoryForm.patchValue({ ProductStyleMatrixRow: '00000000-0000-0000-0000-000000000000' });
      this.InventoryForm.patchValue({ ProductStyleMatrixColumn: '00000000-0000-0000-0000-000000000000' });
      this.InventoryForm.patchValue({ UseExpiryDates: false });
    } else {
      this.InventoryForm.get('GiftVoucher').disable();
      this.InventoryForm.get('UseExpiryDates').disable();
      this.InventoryForm.patchValue({ UseExpiryDates: false });
      this.InventoryForm.patchValue({ GiftVoucher: false });
    }
  }

  switchForProductStyleMatrix() {
    debugger;
    if (this.InventoryForm.get('ProductStyleMatrixEnabled').value) {
      this.InventoryForm.patchValue({ SerialisedProduct: false });
      this.InventoryForm.get('ProductStyleMatrixRow').enable();
      this.InventoryForm.get('ProductStyleMatrixColumn').enable();
      this.InventoryForm.get('UseExpiryDates').enable();
      this.InventoryForm.get('AllowDiscount').enable();
      this.InventoryForm.get('GiftVoucher').disable();
      this.InventoryForm.patchValue({ GiftVoucher: false });
      this.InventoryForm.patchValue({ UseExpiryDates: false });

    } else {
      this.InventoryForm.get('ProductStyleMatrixRow').disable();
      this.InventoryForm.get('ProductStyleMatrixColumn').disable();
      this.InventoryForm.patchValue({ GiftVoucher: false });
      this.InventoryForm.get('UseExpiryDates').disable();
      this.InventoryForm.patchValue({ ProductStyleMatrixRow: '00000000-0000-0000-0000-000000000000' });
      this.InventoryForm.patchValue({ ProductStyleMatrixColumn: '00000000-0000-0000-0000-000000000000' });
    }
  }

  GetInventoryByID(ID) {
    this.inventoryService.getInventoryByID(ID).subscribe((resp: any) => {
      if (resp.isSuccess) {
        this.BindDetails(resp.data.inventorydetails);
        this.onCategoryChange(resp.data.inventorydetails.categoryID)
      }
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onProductStatusChange(value) {
    debugger;
    this.InventoryForm.get('CustomKit').enable();
    this.InventoryForm.get('AllowPurchase').enable();
    this.InventoryForm.get('ProductStyleMatrixEnabled').enable();
    this.InventoryForm.get('SerialisedProduct').enable();
    this.InventoryForm.get('GiftVoucher').enable();
    this.InventoryForm.get('UseWareHousePrice').enable();
    this.InventoryForm.get('BulkItem').enable();
    this.InventoryForm.get('Websellable').enable();
    this.InventoryForm.get('AllowDiscount').enable();
    this.InventoryForm.get('UseExpiryDates').enable();
    if (value == 'F') {
      this.InventoryForm.patchValue({ CustomKit: false });
      this.InventoryForm.get('CustomKit').disable();
      this.InventoryForm.get('AllowDiscount').enable();

    }
    else if (value == 'N') {
      this.InventoryForm.patchValue(
        {
          CustomKit: false,
          AllowPurchase: false,
          ProductStyleMatrixEnabled: false,
          SerialisedProduct: false,
          GiftVoucher: false
        }
      );
      this.InventoryForm.get('CustomKit').disable();
      this.InventoryForm.get('AllowPurchase').disable();
      this.InventoryForm.get('ProductStyleMatrixEnabled').disable();
      this.InventoryForm.get('SerialisedProduct').disable();
      this.InventoryForm.get('GiftVoucher').disable();
      this.InventoryForm.get('AllowDiscount').enable();
      this.switchForProductStyleMatrix();
      this.switchForSerialisedProduct();
    }
    else if (value == 'C') {
      this.InventoryForm.patchValue(
        {
          AllowPurchase: false,
          ProductStyleMatrixEnabled: false,
          SerialisedProduct: false,
          GiftVoucher: false
        }
      );
      this.InventoryForm.get('AllowPurchase').disable();
      this.InventoryForm.get('ProductStyleMatrixEnabled').disable();
      this.InventoryForm.get('SerialisedProduct').disable();
      this.InventoryForm.get('GiftVoucher').disable();
      this.InventoryForm.get('AllowDiscount').enable();
      this.switchForProductStyleMatrix();
      this.switchForSerialisedProduct();
    }
    else if (value == 'D') {
      this.InventoryForm.patchValue(
        {
          CustomKit: false,
          AllowPurchase: false,
          ProductStyleMatrixEnabled: false,
          SerialisedProduct: false,
          GiftVoucher: false,
          UseWareHousePrice: false,
          BulkItem: false,
          Websellable: false,
          AllowDiscount: false,
          UseExpiryDates: false
        }
      );
      this.InventoryForm.get('CustomKit').disable();
      this.InventoryForm.get('AllowPurchase').disable();
      this.InventoryForm.get('ProductStyleMatrixEnabled').disable();
      this.InventoryForm.get('SerialisedProduct').disable();
      this.InventoryForm.get('GiftVoucher').disable();
      this.InventoryForm.get('UseWareHousePrice').disable();
      this.InventoryForm.get('BulkItem').disable();
      this.InventoryForm.get('Websellable').disable();
      this.InventoryForm.get('AllowDiscount').disable();
      this.InventoryForm.get('UseExpiryDates').enable();
      this.switchForProductStyleMatrix();
      this.switchForSerialisedProduct();
    }
  }

  switchForGiftVoucher123() {
    if (this.InventoryForm.get('GiftVoucher').value) {
      this.InventoryForm.patchValue({ SerialisedProduct: true });
      this.switchForSerialisedProduct();
    }
  }

  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;

  BindInventoriesBySearchKey() {
    let InventorySearch = {
      SearchKey: this.InventoryForm.get('SearchKey').value
    }
    if (InventorySearch) {
      this.AgLoad = false;
      this.AgLoad = false;
      this.Mode = "List";
      this.RowData = [];
      this.inventoryService.getInventoryBySearchKey(InventorySearch).subscribe((resp: any) => {
        this.AgLoad = false;
        this.RowData = resp.data.inventory;
        console.log(this.RowData)
        this.Loading = false;
        this.AgLoad = true;
      }, (error) => {
        this.Loading = false;
        this.toastr.error(error);
        console.error('Problem with the sevice. Please try later : ' + error);
      });
    } else {
      this.BindInventories();
    }
  }
  OnchangeSearch() {
    // console.log(this.InventoryForm.get('SearchKey').value)
    this.BindInventoriesBySearchKey();
  }
  AllConfigurationByModuleID() {
    this.configuration.getAllConfigurationByModuleID("INV").subscribe((resp: any) => {
      var Data = resp.data.configurationbyIds.filter(o => o.flag == "Flag6");
      var CanmakeProductActive = resp.data.configurationbyIds.filter(o => o.flag == "Flag32");
      this.BulkFlagCaption = Data[0].value;
      this.CanmakeProductActive = CanmakeProductActive[0].value;
    }, (error) => {
      this.Loading = false;
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
}

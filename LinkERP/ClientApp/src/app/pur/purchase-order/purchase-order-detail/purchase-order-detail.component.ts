import { Component, OnInit, Input, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { EnumExtension } from 'src/app/shared/enums/enum-extension';
import { ProductType } from 'src/app/shared/enums/product-type';
import { PurchaseLineStatus } from 'src/app/shared/enums/purchase-line-status';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ngx-custom-validators';
import { GenricTableIDByName } from 'src/app/shared/enums/enum-generictables';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { PurchaseOrderDetailService } from '../../services/purchase-order-detail.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { LbsPurPurchaseOrderDetails } from 'src/app/models/pur/lbs_pur_purchase-order-details';
import { CurrencyService } from 'src/app/sys/services/currency.service';
import { RequisitionService } from 'src/app/inv/services/requisition.service';
import { TaxCodeService } from 'src/app/sys/services/tax-code.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { PriceGroupsService } from 'src/app/inv/services/price-groups.service';
import { PurCommonService } from '../../services/pur-common.service';
import { IfStmt } from '@angular/compiler';


@Component({
  selector: 'app-purchase-order-detail',
  templateUrl: './purchase-order-detail.component.html',
  styleUrls: ['./purchase-order-detail.component.css']
})
export class PurchaseOrderDetailComponent implements OnInit {
  public purproductList;
  public LineList;
  @Input() PurchaseOrderID: any;
  @Input() VendorID: any;
  @Input() PurchaseStatus: any;
  @Input() isApprover: boolean;
  @Input() IsCreatedBY: boolean;
  IsNextApprover
  @Output() RefreshMaingrid = new EventEmitter<any>();
  @Output() OnUpdatePurchaseStatus = new EventEmitter<any>();
  Mode: any = 'List';
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false
  PurchaseOrderDetailForm: FormGroup;
  submitted: boolean;
  PurchaseOrderDetail: any;
  classification: any;
  BindInventory: any;
  inventoryList: any;
  IsInventory: boolean;
  AccessTab: string;
  read_Access: boolean;
  write_Access: boolean;
  delete_Access: boolean;
  all_Access: boolean;
  CompanyID = localStorage.getItem('CompanyID');
  read: boolean;
  UOMList: any;
  CurrencyID: any = '';
  RequisitionID: any = '';
  supplierSKU: any;
  Currency: any;
  Requisitions: any;
  TaxCode: any;
  IsAllApproved: boolean = false;
  IsAllRejected: boolean = false;
  IsAllNew: boolean = false;
  IsAllReject: boolean;
  modalRef: BsModalRef;
  VendorPriceSchemeList
  SelectedPurchaseOrderDetailID: any;
  UOMListForNonINV: any;
  constructor(
    public sysCommonService: SysCommonService,
    private cryptoAes: CryptoAes,
    private FB: FormBuilder,
    private toastr: ToastrService,
    public purchaseOrderService: PurchaseOrderService,
    public purchaseOrderDetailService: PurchaseOrderDetailService,
    private currencyService: CurrencyService,
    private requisitionservice: RequisitionService,
    private taxCodeService: TaxCodeService,
    public modalService: BsModalService,
    private commonService: InvCommonService,
    private priceservice: PriceGroupsService,
    private purCommonService: PurCommonService
  ) { }

  ngOnInit() {
    this.purproductList = EnumExtension.getNamesAndValuestring(ProductType);
    this.LineList = EnumExtension.getNamesAndValuestring(PurchaseLineStatus);
    this.AgLoad = false;
    this.Mode = "List";
    this.setFormControl();
    this.setAgGridColoumn();
    this.BindSupplierSKU();
    this.SetPermissions();
    this.BindAllOrderDetail();
    this.getAllVendorPriceScheme();
    this.BindCurrency();
    this.BindTax();
    this.BindRequisitions();
    this.BindClassification();
    this.BindInventoryDetail();

    this.onChanges();
  }
  getAllVendorPriceScheme() {
    this.purCommonService.getAllVendorPriceScheme().subscribe((resp: any) => {
      console.log(resp)
      this.VendorPriceSchemeList = resp.data.vendor;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  setFormControl() {
    this.PurchaseOrderDetailForm = this.FB.group({
      ID: [''],
      ProductDescription: [''],
      ProductType: ['INV'],
      Product: ['-1', CustomValidators.notEqual('-1')],
      Classification: ['-1', CustomValidators.notEqual('-1')],
      PurchaseUOM: ['-1', CustomValidators.notEqual('-1')],
      PurchaseLineStatus: ['New'],
      OrderedQuantity: [''],
      ReceivedQuantity: [''],
      UnitCost: [''],
      TaxID: ['-1'],
      TaxRate: [0],
      DiscountType: [0],
      DiscountAmount: [0],
      DiscountedUnitCost: [0],
      LineTotalCostTaxEclusive: [0],
      LineTotalTaxAmount: [0],
      LineTotalCostTaxInclusive: [0],
      ForExcRate: [0],
      ForExcUnitCost: [0],
      ForExcCostTaxEx: [0],
      ForExcCostTaxIn: [0],
      SupplierSKU: this.supplierSKU,
      LineNumber: [''],
      CurrencyID: ['-1', CustomValidators.notEqual('-1')],
      RequisitionID: ['-1'],
      LineTotalHomeAmount: [0],
      LineTotalForeignAmount: [0],
      AllowPartialReceiving: [true],
      ConvertedOrderedQuantity: [0],
      CovertedReceivedQuantity: [0],
      HomeUnitCost: [0],
      DiscountedUnitCostHome: [0],
      LineTotalCostTaxExclusiveHome: [0],
      LineTotalTaxAmountHome: [0],
      LineTotalCostTaxInclusiveHome: [0],
      DiscountedUnitCostForeign: [0],
      LineTotalForeignExchangeTaxAmount: [0],
      HomeConvertedUnitCost: [0],
      VendorPriceSchemeID: ['']
    })
  }

  get f() { return this.PurchaseOrderDetailForm.controls; }

  setAgGridColoumn() {
    this.ColumnDefs = [
      { headerName: 'Product Type', field: 'productType', sortable: true, filter: true, checkboxSelection: false, width: 95, },
      { headerName: 'Product Description', field: 'productDescription', sortable: true, filter: true },
      { headerName: 'Pur Line Status', field: 'purchaseLineStatus', sortable: true, filter: true },
      { headerName: 'Line Number', field: 'lineNo', sortable: true, filter: true },
      // { headerName: 'Date Created', field: 'dateCreated', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: false }
    ];
  }
  SetPermissions() {
    let SesPermissions = JSON.parse(localStorage.getItem('MenuPermissions'));
    let Permissionsstr = this.cryptoAes.DecryptString(SesPermissions);
    let Permissions = JSON.parse(Permissionsstr);
    let index = Permissions.findIndex(c => c.menuID == "307");
    if (index >= 0) {
      let ModulePermissions = Permissions[index];
      this.read_Access = ModulePermissions.read_Access;
      this.write_Access = ModulePermissions.write_Access;
      this.delete_Access = ModulePermissions.delete_Access;
      this.all_Access = ModulePermissions.all_Access;
      this.PurchaseOrderDetailForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          this.PurchaseOrderDetailForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      this.PurchaseOrderDetailForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }

  BindSupplierSKU() {
    this.purchaseOrderDetailService.getSupplierSKU(this.VendorID).subscribe((resp: any) => {
      this.supplierSKU = resp.data.supplierSKU.VendorSKU;
      this.PurchaseOrderDetailForm.patchValue({
        SupplierSKU: this.supplierSKU
      });
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  BindAllOrderDetail() {
    this.AgLoad = false;
    this.Mode = "List";
    this.purchaseOrderDetailService.getPurchaseOrderByID(this.PurchaseOrderID).subscribe((resp: any) => {
      console.log(resp.data.purchaseDetails);
      this.PurchaseOrderDetail = resp.data.purchaseDetails;
      this.RowData = resp.data.purchaseDetails;
      this.AgLoad = true;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  BindOrderDetailByID() {
    // this.AgLoad = false;
    this.Mode = "List";
    this.purchaseOrderService.getPurchaseOrderByID(this.PurchaseOrderID).subscribe((resp: any) => {

      console.log(resp.data.purchaseDetails);
      this.PurchaseOrderDetail = resp.data.purchaseDetails;
      this.RowData = resp.data.purchaseDetails;
      // this.AgLoad = true;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  BindUOM() {
    /*   this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_INV_UnitOfMeasure).subscribe((resp: any) => {
        this.UOMList = resp.data.tabledata;
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      }); */
  }

  //To bind the data of all currency to the Grid.
  BindCurrency() {
    this.Mode = 'List';
    this.sysCommonService.getCurrency().subscribe((resp: any) => {
      console.log(resp);
      this.Currency = resp.data.cuurency;
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindTax() {
    this.priceservice.getalltaxcode().subscribe((resp: any) => {
      console.log(resp);
      this.TaxCode = resp.data.taxcode;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindRequisitions() {

    this.Mode = "List";
    this.requisitionservice.getrequisitions().subscribe((resp: any) => {
      console.log(resp);
      this.Requisitions = resp.data.requisitions;
    }, (error) => {
      this.toastr.error(error);
    });
  }

  BindClassification() {

    this.purchaseOrderDetailService.getClassificationDetail().subscribe((resp: any) => {
      this.classification = resp.data.classifications;
      //this.RowData = resp.data.classifications;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  BindInventoryDetail() {
    // this.AgLoad = false;
    //changed from OrderID
    this.purchaseOrderDetailService.GetInventoryForPO(this.SelectedWharehouseID).subscribe((resp: any) => {
      console.log(resp);
      this.inventoryList = resp.data.productkits;
      //this.RowData = resp.data.inventory;
      // this.AgLoad = true;
    }, (error) => {
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

  AddNewPurchaseDetail() {
    this.Mode = 'Add';
    this.read = true;
  }

  Cancel(): void {
    this.ResetForm();
    this.submitted = false;
    this.Mode = "List";
  }

  //To create the States Form Controls.
  ResetForm() {
    this.PurchaseOrderDetailForm.patchValue({
      ID: '',
      ProductDescription: '',
      ProductType: 'INV',
      Product: '-1',
      Classification: '-1',
      PurchaseUOM: '-1',
      PurchaseLineStatus: 'New',
      OrderedQuantity: '',
      ReceivedQuantity: '',
      TaxID: '-1',
      TaxRate: 0,
      UnitCost: '',
      DiscountType: 0,
      DiscountAmount: 0,
      DiscountedUnitCost: 0,
      LineTotalCostTaxEclusive: 0,
      LineTotalTaxAmount: 0,
      LineTotalCostTaxInclusive: 0,
      ForExcRate: 0,
      ForExcUnitCost: 0,
      ForExcCostTaxEx: 0,
      ForExcCostTaxIn: 0,
      SupplierSKU: this.supplierSKU,
      LineNumber: '',
      CurrencyID: '-1',
      RequisitionID: '-1',
      LineTotalHomeAmount: 0,
      LineTotalForeignAmount: 0,
      AllowPartialReceiving: true
    });
  }
  /* FOR Aggird Start */
  OnActionClick(event: any) {
    var colId = event.column.getId();
    if (colId == 'Edit') {
      this.read = false;
      this.Mode = 'Edit';
      //this.Edit(event.data.id);
      this.SelectedPurchaseOrderDetailID = event.data.id;
      this.GetPurchaseDetailByRecID();
      //this.AgEdit(event.data)
    } else if (colId == 'Delete') {
      this.onDeleteChecked(event.data.id)
    }
  }
  IsEdit: boolean;
  //edit operation
  AgEdit(event) {
    console.log(event);
    this.IsEdit = false;
    this.BindInventoryUOMConversions(event.productID);
    this.PurchaseOrderDetailForm.patchValue({
      ID: event.id,
      CompanyID: event.companyID,
      ProductDescription: event.productDescription,
      PurchaseOrderId: event.purchaseOrderID,
      PurchaseLineStatus: event.purchaseLineStatus,
      ProductType: event.productType,
      Product: event.productID,
      OrderedQuantity: event.orderedQuantity,
      ReceivedQuantity: event.receivedQuantity,
      UnitCost: event.unitCost,
      TaxID: event.taxID,
      TaxRate: event.taxRate,
      DiscountType: event.discountType,
      DiscountAmount: event.discountAmount,
      DiscountedUnitCost: event.discountedUnitCost,
      LineTotalCostTaxEclusive: event.lineTotalCostTaxEclusive,
      LineTotalTaxAmount: event.lineTotalTaxAmount,
      LineTotalCostTaxInclusive: event.lineTotalCostTaxInclusive,
      ForExcRate: event.fxRate,
      ForExcUnitCost: event.foreignExchangeUnitCost,
      ForExcCostTaxEx: event.lineTotalForeignExchangeCostTaxExclusive,
      ForExcCostTaxIn: event.lineTotalForeignExchangeCostTaxInclusive,
      SupplierSKU: event.supplierSKU,
      LineNumber: event.lineNo,
      CurrencyID: event.currencyID,
      RequisitionID: event.requisitionID,
      LineTotalHomeAmount: event.lineTotalHomeAmount,
      LineTotalForeignAmount: event.lineTotalForeignAmount,
      AllowPartialReceiving: event.allowPartialReceiving,
      PurchaseUOM: event.unitOfMeasure,
      Classification: event.classificationID,
      ConvertedOrderedQuantity: event.convertedOrderedQuantity,
      CovertedReceivedQuantity: event.covertedReceivedQuantity,
      HomeUnitCost: event.homeUnitCost,
      DiscountedUnitCostHome: event.discountedUnitCostHome,
      LineTotalCostTaxExclusiveHome: event.lineTotalCostTaxExclusiveHome,
      LineTotalTaxAmountHome: event.lineTotalTaxAmountHome,
      LineTotalCostTaxInclusiveHome: event.lineTotalCostTaxInclusiveHome,
      DiscountedUnitCostForeign: event.discountedUnitCostForeign,
      LineTotalForeignExchangeTaxAmount: event.lineTotalForeignExchangeTaxAmount,
      HomeConvertedUnitCost: event.homeConvertedUnitCost,
      VendorPriceSchemeID: event.vendorPriceSchemeID

    });
    if (event.productType == "INV") {
      this.PurchaseOrderDetailForm.get('ProductDescription').disable();
      this.PurchaseOrderDetailForm.get('Product').enable();
    }
    else {
      this.IsInventory = false;
      this.PurchaseOrderDetailForm.patchValue({
        Product: ''
      });
      this.PurchaseOrderDetailForm.get('Product').disable();
      this.PurchaseOrderDetailForm.get('ProductDescription').enable();
    }
    let LineTotalCostTaxEclusive = this.PurchaseOrderDetailForm.get('LineTotalCostTaxEclusive').value;

    let LineTotalTaxAmount = this.PurchaseOrderDetailForm.get('LineTotalTaxAmount').value;
    let TaxInclusive = Number(Number(LineTotalCostTaxEclusive) + Number(LineTotalTaxAmount)).toFixed(4);
    this.PurchaseOrderDetailForm.patchValue({
      LineTotalCostTaxInclusive: TaxInclusive
    });
  }
  onDeleteChecked(ID) {
    this.purchaseOrderDetailService.deletePurchaseOrderDetailID(ID, 'LBS_PUR_PurchaseDetails', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        this.BindAllOrderDetail();
      }

    }, (error) => {
      // console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }

  GetPurchaseDetailByRecID() {
    // this.AgLoad = false;
    this.purchaseOrderDetailService.GetPurchaseDetailByRecID(this.SelectedPurchaseOrderDetailID).subscribe((resp: any) => {
      console.log(resp);
      this.AgEdit(resp.data.purchaseDetails);
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onSaveold() {
    // this.confirmation.ConfirmationPopup('Are you sure to save record?');
  }
  onSave(SaveAction) {
    this.submitted = true;
    if (this.PurchaseOrderDetailForm.invalid) {
      return;
    }

    let purchaseorderdetails = new LbsPurPurchaseOrderDetails();
    purchaseorderdetails.ProductDescription = this.PurchaseOrderDetailForm.get('ProductDescription').value;
    purchaseorderdetails.CompanyID = this.CompanyID;
    purchaseorderdetails.PurchaseOrderID = this.PurchaseOrderID;
    purchaseorderdetails.ProductType = this.PurchaseOrderDetailForm.get('ProductType').value;
    purchaseorderdetails.ProductID = this.PurchaseOrderDetailForm.get('Product').value;
    purchaseorderdetails.ClassificationID = this.PurchaseOrderDetailForm.get('Classification').value;
    purchaseorderdetails.UnitOfMeasure = this.PurchaseOrderDetailForm.get('PurchaseUOM').value;
    purchaseorderdetails.PurchaseLineStatus = this.PurchaseOrderDetailForm.get('PurchaseLineStatus').value;
    purchaseorderdetails.OrderedQuantity = this.PurchaseOrderDetailForm.get('OrderedQuantity').value;
    purchaseorderdetails.ReceivedQuantity = this.PurchaseOrderDetailForm.get('ReceivedQuantity').value;
    purchaseorderdetails.UnitCost = this.PurchaseOrderDetailForm.get('UnitCost').value;
    purchaseorderdetails.DiscountType = this.PurchaseOrderDetailForm.get('DiscountType').value;

    purchaseorderdetails.DiscountAmount = this.PurchaseOrderDetailForm.get('DiscountAmount').value;
    purchaseorderdetails.DiscountedUnitCost = this.PurchaseOrderDetailForm.get('DiscountedUnitCost').value;
    purchaseorderdetails.LineTotalCostTaxEclusive = this.PurchaseOrderDetailForm.get('LineTotalCostTaxEclusive').value;
    purchaseorderdetails.TaxID = this.PurchaseOrderDetailForm.get('TaxID').value;
    purchaseorderdetails.TaxRate = this.PurchaseOrderDetailForm.get('TaxRate').value;
    purchaseorderdetails.LineTotalTaxAmount = this.PurchaseOrderDetailForm.get('LineTotalTaxAmount').value;
    purchaseorderdetails.LineTotalCostTaxInclusive = this.PurchaseOrderDetailForm.get('LineTotalCostTaxInclusive').value;
    purchaseorderdetails.CurrencyID = this.PurchaseOrderDetailForm.get('CurrencyID').value;
    purchaseorderdetails.FXRate = this.PurchaseOrderDetailForm.get('ForExcRate').value;
    purchaseorderdetails.ForeignExchangeUnitCost = this.PurchaseOrderDetailForm.get('ForExcUnitCost').value;
    purchaseorderdetails.LineTotalForeignExchangeCostTaxExclusive = this.PurchaseOrderDetailForm.get('ForExcCostTaxEx').value;
    purchaseorderdetails.LineTotalForeignExchangeCostTaxInclusive = this.PurchaseOrderDetailForm.get('ForExcCostTaxIn').value;
    purchaseorderdetails.LineTotalForeignAmount = this.PurchaseOrderDetailForm.get('LineTotalForeignAmount').value;
    purchaseorderdetails.LineTotalHomeAmount = this.PurchaseOrderDetailForm.get('LineTotalHomeAmount').value;
    purchaseorderdetails.SupplierSKU = this.PurchaseOrderDetailForm.get('SupplierSKU').value;
    purchaseorderdetails.AllowPartialReceiving = this.PurchaseOrderDetailForm.get('AllowPartialReceiving').value;
    purchaseorderdetails.RequisitionID = this.PurchaseOrderDetailForm.get('RequisitionID').value;
    purchaseorderdetails.CreatedBY = localStorage.getItem('LoginID');
    purchaseorderdetails.DateCreated = new Date();
    purchaseorderdetails.ConvertedOrderedQuantity = this.PurchaseOrderDetailForm.get('ConvertedOrderedQuantity').value;
    purchaseorderdetails.DiscountedUnitCostHome = this.PurchaseOrderDetailForm.get('DiscountedUnitCostHome').value;
    purchaseorderdetails.HomeUnitCost = this.PurchaseOrderDetailForm.get('HomeUnitCost').value;
    purchaseorderdetails.CovertedReceivedQuantity = this.PurchaseOrderDetailForm.get('CovertedReceivedQuantity').value;
    purchaseorderdetails.VendorPriceSchemeID = this.PurchaseOrderDetailForm.get('VendorPriceSchemeID').value;
    purchaseorderdetails.HomeConvertedUnitCost = this.PurchaseOrderDetailForm.get('HomeConvertedUnitCost').value;
    purchaseorderdetails.DiscountedUnitCostForeign = this.PurchaseOrderDetailForm.get('DiscountedUnitCostForeign').value;
    purchaseorderdetails.LineTotalForeignExchangeTaxAmount = this.PurchaseOrderDetailForm.get('LineTotalForeignExchangeTaxAmount').value;
    purchaseorderdetails.DiscountedUnitCostForeign = this.PurchaseOrderDetailForm.get('DiscountedUnitCostForeign').value;
    purchaseorderdetails.LineTotalCostTaxInclusiveHome = this.PurchaseOrderDetailForm.get('LineTotalCostTaxInclusiveHome').value;
    purchaseorderdetails.LineTotalTaxAmountHome = this.PurchaseOrderDetailForm.get('LineTotalTaxAmountHome').value;
    purchaseorderdetails.LineTotalCostTaxExclusiveHome = this.PurchaseOrderDetailForm.get('LineTotalCostTaxExclusiveHome').value;
    console.log(purchaseorderdetails);

    if (this.Mode == 'Add') {
      this.purchaseOrderDetailService.addPurchaseOrderDetail(purchaseorderdetails).subscribe((resp: any) => {

        if (resp.isSuccess == true) {
          this.RefreshMaingrid.emit('');
          this.toastr.success('Purchase Order details added successfully');
          /*  this.ResetForm();
           this.BindAllOrderDetail();
           this.Mode = 'List'; */
          this.submitted = false;

          if (SaveAction == 'Close') {
            this.Cancel();
            this.ResetForm();
            this.BindAllOrderDetail();
            this.Mode = 'List';
          }
          else {
            this.ResetForm();

            this.SelectedPurchaseOrderDetailID = resp.data.id;
            this.GetPurchaseDetailByRecID();
          }
        }
      },
        (error) => {
          console.error('Problem with the sevice. Please try later : ' + error.message);
        });
    }
    else if (this.Mode == 'Edit') {
      purchaseorderdetails.ID = this.PurchaseOrderDetailForm.get('ID').value;
      console.log(purchaseorderdetails);
      this.purchaseOrderDetailService.UpdatePurchaseOrderDetail(purchaseorderdetails).subscribe((resp: any) => {
        if (resp.isSuccess == true) {
          this.RefreshMaingrid.emit('');
          this.toastr.success('Purchase Order details updated successfully');
          /* this.ResetForm();
           this.BindAllOrderDetail();
           this.Mode = 'List'; */
          this.submitted = false;

          if (SaveAction == 'Close') {
            this.Cancel();
            this.ResetForm();
            this.BindAllOrderDetail();
            this.Mode = 'List';
          }
          else {
            this.ResetForm();
            this.SelectedPurchaseOrderDetailID = resp.data.id;
            this.GetPurchaseDetailByRecID();
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

  onOptionSelected(index, event, Status) {
    console.log(event);
    this.IsAllApproved = false;
    this.IsAllRejected = false;
    this.IsAllNew = false;
    if (event.target.checked) {
      this.RowData[index].purchaseLineStatus = Status;
    } else {
      this.RowData[index].purchaseLineStatus = 'New';
    }
  }

  CheckReject() {
    let Reject = this.RowData.find(ob => ob['purchaseLineStatus'] != 'Rejected');
    if (Reject) {
      this.IsAllReject = false;
    } else {
      this.IsAllReject = true;
    }
  }

  EditRoleModule(index) {
    this.read = false;
    this.Mode = 'Edit';
    this.SelectedPurchaseOrderDetailID = this.RowData[index].id;
    this.GetPurchaseDetailByRecID();
    //this.AgEdit(this.RowData[index])
  }
  DeleteRoleModule(index) {
    this.onDeleteChecked(this.RowData[index].id)
  }

  UpdateStatus() {
    let lstLbsPurPurchaseOrderDetails: LbsPurPurchaseOrderDetails[] = [];
    for (let i = 0; i <= this.RowData.length - 1; i++) {
      let _LbsPurPurchaseOrderDetails = new LbsPurPurchaseOrderDetails();
      _LbsPurPurchaseOrderDetails.PurchaseLineStatus = this.RowData[i].purchaseLineStatus;
      _LbsPurPurchaseOrderDetails.ID = this.RowData[i].id;
      lstLbsPurPurchaseOrderDetails.push(_LbsPurPurchaseOrderDetails);
    }
    this.purchaseOrderDetailService.updatePurchaseOrderDetailsStatus(lstLbsPurPurchaseOrderDetails).subscribe((resp: any) => {
      this.toastr.success(' Details updated successfully')
      this.ResetForm();
      this.BindAllOrderDetail();
      this.Mode = 'List';

    }, (error) => {
      //  console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  checkAll(event, Status) {
    console.log(event);
    this.IsAllApproved = false;
    this.IsAllRejected = false;
    this.IsAllNew = false;
    if (Status == 'Approved') {
      this.IsAllApproved = true;
    } else if (Status == 'Rejected') {
      this.IsAllRejected = true;
    }
    else if (Status == 'New') {
      this.IsAllNew = true;
    }
    if (!event.target.checked) {
      Status = 'New';
    }
    for (let i = 0; i <= this.RowData.length - 1; i++) {
      if (this.RowData[i].purchaseLineStatus != 'Approved' || Status == 'New') {
        this.RowData[i].purchaseLineStatus = Status;
      }
    }
  }
  ConfirmDialogClose() {
    this.modalRef.hide();
  }

  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
  productTypeStatus(ID) {
    if (ID == "INV") {
      this.PurchaseOrderDetailForm.get('ProductDescription').disable();
      this.PurchaseOrderDetailForm.get('Product').enable();
    }
    else {
      this.IsInventory = false;
      this.PurchaseOrderDetailForm.patchValue({
        Product: '',
        ProductDescription: ''
      });
      this.PurchaseOrderDetailForm.get('Product').disable();
      this.PurchaseOrderDetailForm.get('ProductDescription').enable();
    }
  }
  onProductChange(id) {
    debugger;
    let unitCost = 0;
    let des = "";
    if (id != "-1") {
      this.BindInventoryUOMConversions(id);
      let index = this.inventoryList.findIndex(c => c.id == id);
      if (index >= 0) {
        unitCost = this.inventoryList[index].inventoryDefaultCost;
        des = this.inventoryList[index].productName;
      }
    }
    this.PurchaseOrderDetailForm.patchValue({
      UnitCost: unitCost,
      ProductDescription: des
    });

  }
  BindInventoryUOMConversions(InventoryID) {
    this.UOMList = [];
    this.sysCommonService.getUOMConvertionsByInventryID(InventoryID).subscribe((resp: any) => {
      this.UOMList = resp.data.inventoryunitofmeasure;
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  SelectedRequisitionID: any;
  ProductID: any;
  SelectedPurchaseDetail_ID: any;
  SelectedWharehouseID: any;
  SelectedQuantity: any;
  ProductMatrix(matrix: TemplateRef<any>, i) {
    debugger;
    this.ProductID = this.RowData[i].productID;
    this.SelectedPurchaseDetail_ID = this.RowData[i].id;
    this.SelectedQuantity = this.RowData[i].receivedQuantity;
    this.modalRef = this.modalService.show(matrix);
  }

  Closenote() {
    this.modalRef.hide();
    this.BindAllOrderDetail();
  }

  onChanges() {
    debugger;
    this.PurchaseOrderDetailForm.get('ForExcRate').valueChanges.subscribe(val => {
      let UnitCost = this.PurchaseOrderDetailForm.get('UnitCost').value;
      let HomeUnitCost = Number(Number(val) * Number(UnitCost)).toFixed(4);
      this.PurchaseOrderDetailForm.patchValue({
        HomeUnitCost: HomeUnitCost
      });
    });

    this.PurchaseOrderDetailForm.get('UnitCost').valueChanges.subscribe(val => {
      let FXRate = this.PurchaseOrderDetailForm.get('ForExcRate').value;
      let HomeUnitCost = Number(Number(val) * Number(FXRate)).toFixed(4);

      let DiscountAmount = this.PurchaseOrderDetailForm.get('DiscountAmount').value;
      let per = ((val / 100) * DiscountAmount).toFixed(4);
      let discountedUnitCostForeign = Number(Number(val) - Number(per)).toFixed(4);
      this.PurchaseOrderDetailForm.patchValue({
        HomeUnitCost: HomeUnitCost,
        DiscountedUnitCostForeign: discountedUnitCostForeign
      });
    });

    this.PurchaseOrderDetailForm.get('OrderedQuantity').valueChanges.subscribe(val => {
      let UOM = this.PurchaseOrderDetailForm.get('PurchaseUOM').value;
      this.ChangeConvertedQuantity(val, UOM);
      let HomeUnitCost = this.PurchaseOrderDetailForm.get('HomeUnitCost').value;
      let ConvertedOrderedQuantity = this.PurchaseOrderDetailForm.get('ConvertedOrderedQuantity').value;
      this.OnchangeHomeConvertedUnitCost(val, HomeUnitCost, ConvertedOrderedQuantity);
      let DiscountedUnitCost = this.PurchaseOrderDetailForm.get('DiscountedUnitCost').value;
      let lineTotalCostTaxEclusive = (DiscountedUnitCost * val).toFixed(4);

      let DiscountedUnitCostForeign = this.PurchaseOrderDetailForm.get('DiscountedUnitCostForeign').value;
      let forExcCostTaxEx = Number(Number(DiscountedUnitCostForeign) * Number(val)).toFixed(4);
      this.PurchaseOrderDetailForm.patchValue({
        LineTotalCostTaxEclusive: lineTotalCostTaxEclusive,
        ForExcCostTaxEx: forExcCostTaxEx
      });
    });

    this.PurchaseOrderDetailForm.get('PurchaseUOM').valueChanges.subscribe(val => {
      let OrderedQuantity = this.PurchaseOrderDetailForm.get('OrderedQuantity').value;
      if (!OrderedQuantity) {
        OrderedQuantity = 0;
      }
      this.ChangeConvertedQuantity(OrderedQuantity, val);
    });

    this.PurchaseOrderDetailForm.get('HomeUnitCost').valueChanges.subscribe(val => {
      let OrderedQuantity = this.PurchaseOrderDetailForm.get('OrderedQuantity').value;
      let ConvertedOrderedQuantity = this.PurchaseOrderDetailForm.get('ConvertedOrderedQuantity').value;
      this.OnchangeHomeConvertedUnitCost(OrderedQuantity, val, ConvertedOrderedQuantity);
      let DiscountAmount = this.PurchaseOrderDetailForm.get('DiscountAmount').value;
      let per = ((val / 100) * DiscountAmount).toFixed(4)
      let discountedUnitCost = Number(Number(val) - Number(per)).toFixed(4);
      this.PurchaseOrderDetailForm.patchValue({
        DiscountedUnitCost: discountedUnitCost
      });
    });
    this.PurchaseOrderDetailForm.get('ConvertedOrderedQuantity').valueChanges.subscribe(val => {
      let OrderedQuantity = this.PurchaseOrderDetailForm.get('OrderedQuantity').value;
      let HomeUnitCost = this.PurchaseOrderDetailForm.get('HomeUnitCost').value;
      this.OnchangeHomeConvertedUnitCost(OrderedQuantity, HomeUnitCost, val)
    });
    this.PurchaseOrderDetailForm.get('DiscountAmount').valueChanges.subscribe(val => {
      let HomeUnitCost = this.PurchaseOrderDetailForm.get('HomeUnitCost').value;
      let per = ((HomeUnitCost / 100) * val).toFixed(4)
      let discountedUnitCost = Number(Number(HomeUnitCost) - Number(per)).toFixed(4);

      let UnitCost = this.PurchaseOrderDetailForm.get('UnitCost').value;
      let per2 = ((UnitCost / 100) * val).toFixed(4);
      let discountedUnitCostForeign = Number(Number(UnitCost) - Number(per2)).toFixed(4);

      this.PurchaseOrderDetailForm.patchValue({
        DiscountedUnitCost: discountedUnitCost,
        DiscountedUnitCostForeign: discountedUnitCostForeign
      });
    });
    this.PurchaseOrderDetailForm.get('DiscountedUnitCost').valueChanges.subscribe(val => {
      let OrderedQuantity = this.PurchaseOrderDetailForm.get('OrderedQuantity').value;
      let lineTotalCostTaxEclusive = (OrderedQuantity * val).toFixed(4);
      this.PurchaseOrderDetailForm.patchValue({
        LineTotalCostTaxEclusive: lineTotalCostTaxEclusive
      });
    });
    this.PurchaseOrderDetailForm.get('LineTotalCostTaxEclusive').valueChanges.subscribe(val => {
      debugger;
      let TaxRate = this.PurchaseOrderDetailForm.get('TaxRate').value;
      let per = ((val / 100) * TaxRate).toFixed(4);
      let LineTotalTaxAmount = this.PurchaseOrderDetailForm.get('LineTotalTaxAmount').value;
      let TaxInclusive = Number(Number(LineTotalTaxAmount) + Number(val)).toFixed(4);
      this.PurchaseOrderDetailForm.patchValue({
        LineTotalTaxAmount: per,
        LineTotalCostTaxInclusive: TaxInclusive
      });
    });
    this.PurchaseOrderDetailForm.get('TaxRate').valueChanges.subscribe(val => {
      let LineTotalCostTaxEclusive = this.PurchaseOrderDetailForm.get('LineTotalCostTaxEclusive').value;
      let per = ((LineTotalCostTaxEclusive / 100) * val).toFixed(4);

      let ForExcCostTaxEx = this.PurchaseOrderDetailForm.get('ForExcCostTaxEx').value;
      let per2 = ((ForExcCostTaxEx / 100) * val).toFixed(4);
      this.PurchaseOrderDetailForm.patchValue({
        LineTotalTaxAmount: per,
        LineTotalForeignExchangeTaxAmount: per2
      });
    });

    this.PurchaseOrderDetailForm.get('LineTotalTaxAmount').valueChanges.subscribe(val => {
      let LineTotalCostTaxEclusive = this.PurchaseOrderDetailForm.get('LineTotalCostTaxEclusive').value;
      let TaxInclusive = Number(Number(LineTotalCostTaxEclusive) + Number(val)).toFixed(4);
      this.PurchaseOrderDetailForm.patchValue({
        LineTotalCostTaxInclusive: TaxInclusive
      });
    });

    this.PurchaseOrderDetailForm.get('DiscountedUnitCostForeign').valueChanges.subscribe(val => {
      let OrderedQuantity = this.PurchaseOrderDetailForm.get('OrderedQuantity').value;
      let forExcCostTaxEx = Number(Number(OrderedQuantity) * Number(val)).toFixed(4);
      this.PurchaseOrderDetailForm.patchValue({
        ForExcCostTaxEx: forExcCostTaxEx
      });
    });

    this.PurchaseOrderDetailForm.get('ForExcCostTaxEx').valueChanges.subscribe(val => {
      let TaxRate = this.PurchaseOrderDetailForm.get('TaxRate').value;
      let per = ((val / 100) * TaxRate).toFixed(4);

      let LineTAmount = this.PurchaseOrderDetailForm.get('LineTotalForeignExchangeTaxAmount').value;
      let per2 = Number(Number(LineTAmount) + Number(val)).toFixed(4);
      this.PurchaseOrderDetailForm.patchValue({
        LineTotalForeignExchangeTaxAmount: per,
        ForExcCostTaxIn: per2
      });
    });
    this.PurchaseOrderDetailForm.get('LineTotalForeignExchangeTaxAmount').valueChanges.subscribe(val => {

      let ForExcCostTaxEx = this.PurchaseOrderDetailForm.get('ForExcCostTaxEx').value;
      console.log(val);
      let per = Number(Number(ForExcCostTaxEx) + Number(val)).toFixed(4);
      this.PurchaseOrderDetailForm.patchValue({
        ForExcCostTaxIn: per
      });
    });

  }
  ChangeConvertedQuantity(OrderedQuantity, UOM) {
    // let UOM=this.PurchaseOrderDetailForm.get('PurchaseUOM').value;
    let index2 = this.UOMList.findIndex(c => c.uomidFrom == UOM);
    let conqty = 0;
    if (index2 >= 0) {
      conqty = this.UOMList[index2].conversionRatio;
    }
    if (conqty == 0) {
      conqty = 1;
    }
    let convertedQuantity = Number(OrderedQuantity) * conqty
    this.PurchaseOrderDetailForm.patchValue({
      ConvertedOrderedQuantity: convertedQuantity
    });
  }
  OnchangeHomeConvertedUnitCost(OrderedQuantity, HomeUnitCost, ConvertedOrderedQuantity) {
    let homeCost = (Number(OrderedQuantity) * Number(HomeUnitCost));
    if (Number(ConvertedOrderedQuantity) > 0) {
      let homeConvertedUnitCost = Number(homeCost / Number(ConvertedOrderedQuantity)).toFixed(4);
      this.PurchaseOrderDetailForm.patchValue({
        HomeConvertedUnitCost: homeConvertedUnitCost
      });
    }
  }
  UpdatePurchaseStatus(Status) {
    this.UpdateStatus();
    this.OnUpdatePurchaseStatus.emit(Status)
  }

  onlyNumberKey(event) {
    return (event.charCode === 8 || event.charCode == 0) ? null : event.charCode >= 46 && event.charCode <= 57;
  }
}

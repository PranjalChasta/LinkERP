import { Component, OnInit, Input, Output, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { ToastrService } from 'ngx-toastr';
import { PurchaseOrderService } from 'src/app/pur/services/purchase-order.service';
import { PurchaseOrderDetailService } from 'src/app/pur/services/purchase-order-detail.service';
import { CurrencyService } from 'src/app/sys/services/currency.service';
import { RequisitionService } from 'src/app/inv/services/requisition.service';
import { TaxCodeService } from 'src/app/sys/services/tax-code.service';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { PriceGroupsService } from 'src/app/inv/services/price-groups.service';
import { PurCommonService } from 'src/app/pur/services/pur-common.service';
import { EnumExtension } from 'src/app/shared/enums/enum-extension';
import { ProductType } from 'src/app/shared/enums/product-type';
import { PurchaseLineStatus } from 'src/app/shared/enums/purchase-line-status';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { GenricTableIDByName } from 'src/app/shared/enums/enum-generictables';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';

@Component({
  selector: 'app-purchase-orderdetail-inline',
  templateUrl: './purchase-orderdetail-inline.component.html',
  styleUrls: ['./purchase-orderdetail-inline.component.css']
})
export class PurchaseOrderdetailInlineComponent implements OnInit {

  public purproductList;
  public LineList;
  @Input() PurchaseOrderID: any;
  @Input() VendorID: any;
  @Input() PurchaseStatus: any;
  @Input() isApprover: boolean;
  @Input() IsCreatedBY: boolean;
  @Input() SelectedCurrencyID: any;
  @Input() IsParentIsactive: boolean;
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
  disableAll: boolean;
  UOMListForNonINV: any;
  TempUOM: any;
  ForeignExchangeRate: any;
  desablevenderpriceANDRequisition: boolean = true;
  BindUnitcostwhenchangeUOM: any;
  BindVenderschemeIdOnChanheUOM: any;
  OnchangeproductID: any;
  OnchangeUnitCostValue: any = 0;
  OnchangeUnitCostIndex: any;
  CostViewData: any;
  Loading: any = false;

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
    private purCommonService: PurCommonService,
    private deleteRecordsService: DeleteRecordsService,
  ) { }
  ngOnInit() {
    this.getcurencybyid();
    this.purproductList = EnumExtension.getNamesAndValuestring(ProductType);
    this.LineList = EnumExtension.getNamesAndValuestring(PurchaseLineStatus);
    this.AgLoad = false;
    this.Mode = "List";
    this.write_Access = true;
    // this.setFormControl();
    this.BindTax();
    this.setAgGridColoumn();
    this.BindSupplierSKU();
    this.BindUOMForNonINV();
    this.BindAllOrderDetail();
    this.getAllVendorPriceScheme();
    this.BindCurrency();
    this.BindRequisitions();
    this.BindClassification();
    this.BindInventoryDetail();
    //this.getcurencybyid();

  }
  getAllVendorPriceScheme() {
    this.Loading = true;
    this.purCommonService.getAllVendorPriceScheme().subscribe((resp: any) => {

      this.VendorPriceSchemeList = resp.data.vendor;
      this.Loading = false;

    }, (error) => {
      this.Loading = false;
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }


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
      // this.PurchaseOrderDetailForm.enable();
      if (!this.all_Access) {
        if (!this.write_Access) {
          //this.PurchaseOrderDetailForm.disable();
        }
      } else {
        this.read_Access = true;
        this.write_Access = true;
        this.delete_Access = true;
        this.all_Access = true;
      }
    }
    else {
      // this.PurchaseOrderDetailForm.disable();
      this.read_Access = false;
      this.write_Access = false;
      this.delete_Access = false;
      this.all_Access = false;
    }

  }

  BindSupplierSKU() {
    this.purchaseOrderDetailService.getSupplierSKU(this.VendorID).subscribe((resp: any) => {
      this.supplierSKU = resp.data.supplierSKU.VendorSKU;
      if (this.PurchaseOrderDetailForm) {
        this.PurchaseOrderDetailForm.patchValue({
          SupplierSKU: this.supplierSKU
        });
      }
      
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  /*  getcurencybyid() {
     this.purchaseOrderDetailService.getcurencybyid(this.PurchaseOrderID, this.SelectedCurrencyID).subscribe((resp: any) => {
 debugger;
       this.ForeignExchangeRate = resp.data.currency
      if( this.ForeignExchangeRate==null)
       {
         this.ForeignExchangeRate=0;
       }
     else{
       this.ForeignExchangeRate = this.ForeignExchangeRate.TransactionRate.toFixed(Math.max(((this.ForeignExchangeRate.TransactionRate + '').split(".")).length, 2));
       
     }
       // for (let i = 0; i <= this.RowData.length - 1; i++) {
       //   this.RowData[i].fxRate=this.ForeignExchangeRate;
       // }
       //console.log(this.ForeignExchangeRate.TransactionRate)
     }, (error) => {
       console.error('Problem with the sevice. Please try later : ' + error);
     });
   } */
  getcurencybyid() {
    this.purchaseOrderDetailService.getcurencybyid(this.PurchaseOrderID, this.SelectedCurrencyID).subscribe((resp: any) => {
      if (resp.data.currency) {
        this.ForeignExchangeRate = resp.data.currency.TransactionRate
        if (this.ForeignExchangeRate == null || this.ForeignExchangeRate == undefined) {
          this.ForeignExchangeRate = 0;
        }
        else {
          this.ForeignExchangeRate = this.ForeignExchangeRate.toFixed(Math.max(((this.ForeignExchangeRate + '').split(".")).length, 4));

        }
      }
     
      // for (let i = 0; i <= this.RowData.length - 1; i++) {
      //   this.RowData[i].fxRate=this.ForeignExchangeRate;
      // }
      //console.log(this.ForeignExchangeRate.TransactionRate)
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindAllOrderDetail() {

    this.AgLoad = false;
    this.Loading = true;
    this.Mode = "List";
    this.purchaseOrderDetailService.getPurchaseOrderByID(this.PurchaseOrderID).subscribe((resp: any) => {

      this.PurchaseOrderDetail = resp.data.purchaseDetails;
      this.RowData = resp.data.purchaseDetails;
      console.log(this.RowData)

      if (this.RowData.length == 0) {
        this.AddNewPurchaseDetail();
      } else {
        for (let i = 0; i <= resp.data.purchaseDetails.length - 1; i++) {
          //---TwoDigit Decial Number---
          // var okk=this.RowData[i].orderedQuantity.toFixed(Math.max((( this.RowData[i].orderedQuantity+'').split(".")).length, 2));
          if (this.RowData[i].orderedQuantity) {
            this.RowData[i].orderedQuantity = this.RowData[i].orderedQuantity.toFixed(Math.max(((this.RowData[i].orderedQuantity + '').split(".")).length, 2));
          }
          if (this.RowData[i].convertedOrderedQuantity) {
            this.RowData[i].convertedOrderedQuantity = this.RowData[i].convertedOrderedQuantity.toFixed(Math.max(((this.RowData[i].convertedOrderedQuantity + '').split(".")).length, 2));
          }
          if (this.RowData[i].fxRate == null || this.RowData[i].fxRate == '') {
            this.RowData[i].fxRate = 0;
          }
          this.RowData[i].fxRate = this.RowData[i].fxRate.toFixed(Math.max(((this.RowData[i].fxRate + '').split(".")).length, 4));
          this.RowData[i].unitCost = this.RowData[i].unitCost.toFixed(Math.max(((this.RowData[i].unitCost + '').split(".")).length, 2));
          this.RowData[i].homeUnitCost = this.RowData[i].homeUnitCost.toFixed(Math.max(((this.RowData[i].homeUnitCost + '').split(".")).length, 2));
          this.RowData[i].homeConvertedUnitCost = this.RowData[i].homeConvertedUnitCost.toFixed(Math.max(((this.RowData[i].homeConvertedUnitCost + '').split(".")).length, 2));
          this.RowData[i].discountAmount = this.RowData[i].discountAmount.toFixed(Math.max(((this.RowData[i].discountAmount + '').split(".")).length, 2));
          this.RowData[i].lineTotalTaxAmount = this.RowData[i].lineTotalTaxAmount.toFixed(Math.max(((this.RowData[i].lineTotalTaxAmount + '').split(".")).length, 2));
          this.RowData[i].lineTotalCostTaxInclusive = this.RowData[i].lineTotalCostTaxInclusive.toFixed(Math.max(((this.RowData[i].lineTotalCostTaxInclusive + '').split(".")).length, 2));
          this.RowData[i].lineTotalForeignExchangeCostTaxExclusive = this.RowData[i].lineTotalForeignExchangeCostTaxExclusive.toFixed(Math.max(((this.RowData[i].lineTotalForeignExchangeCostTaxExclusive + '').split(".")).length, 2));
          this.RowData[i].discountedUnitCostHome = this.RowData[i].discountedUnitCostHome.toFixed(Math.max(((this.RowData[i].discountedUnitCostHome + '').split(".")).length, 2));
          this.RowData[i].discountedUnitCostForeign = this.RowData[i].discountedUnitCostForeign.toFixed(Math.max(((this.RowData[i].discountedUnitCostForeign + '').split(".")).length, 2));
          this.RowData[i].lineTotalForeignExchangeTaxAmount = this.RowData[i].lineTotalForeignExchangeTaxAmount.toFixed(Math.max(((this.RowData[i].lineTotalForeignExchangeTaxAmount + '').split(".")).length, 2));
          this.RowData[i].lineTotalForeignExchangeCostTaxInclusive = this.RowData[i].lineTotalForeignExchangeCostTaxInclusive.toFixed(Math.max(((this.RowData[i].lineTotalForeignExchangeCostTaxInclusive + '').split(".")).length, 2));
          this.RowData[i].foreignExchangeUnitCost = this.RowData[i].foreignExchangeUnitCost.toFixed(Math.max(((this.RowData[i].foreignExchangeUnitCost + '').split(".")).length, 2));
          this.RowData[i].lineTotalForeignAmount = this.RowData[i].lineTotalForeignAmount.toFixed(Math.max(((this.RowData[i].lineTotalForeignAmount + '').split(".")).length, 2));
          //this.RowData[i].lineTotalHomeAmount=this.RowData[i].lineTotalHomeAmount.toFixed(Math.max((( this.RowData[i].lineTotalHomeAmount+'').split(".")).length, 2));   
          this.RowData[i].lineTotalCostTaxExclusiveHome = this.RowData[i].lineTotalCostTaxExclusiveHome.toFixed(Math.max(((this.RowData[i].lineTotalCostTaxExclusiveHome + '').split(".")).length, 4));
          this.RowData[i].lineTotalTaxAmountHome = this.RowData[i].lineTotalTaxAmountHome.toFixed(Math.max(((this.RowData[i].lineTotalTaxAmountHome + '').split(".")).length, 4));
          this.RowData[i].lineTotalCostTaxInclusiveHome = this.RowData[i].lineTotalCostTaxInclusiveHome.toFixed(Math.max(((this.RowData[i].lineTotalCostTaxInclusiveHome + '').split(".")).length, 4));
          //---FourDigit Decimal----
          this.RowData[i].taxRate = this.RowData[i].taxRate ? this.RowData[i].taxRate.toFixed(Math.max(((this.RowData[i].taxRate + '').split(".")).length, 4)) : 0;
          this.RowData[i].lineTotalCostTaxEclusive = this.RowData[i].lineTotalCostTaxEclusive.toFixed(Math.max(((this.RowData[i].lineTotalCostTaxEclusive + '').split(".")).length, 4));
          this.RowData[i].lineTotalHomeAmount = this.RowData[i].lineTotalHomeAmount.toFixed(Math.max(((this.RowData[i].lineTotalHomeAmount + '').split(".")).length, 4));
          this.BindInventoryUOMConversions(this.RowData[i].productID, i);
          this.OnquantityChange(i);
          console.log(this.RowData)
          let productID = this.RowData[i].productID;
          if (productID) {
            this.InventoryUOMConversions(productID, i);
            if (this.inventoryList) {
              let index = this.inventoryList.findIndex(c => c.id == productID)
              if (index >= 0) {
                this.RowData[i].productDescription = this.inventoryList[index].productName;
                if (this.RowData[i].taxID == null) {
                  this.RowData[i].taxID = this.inventoryList[index].taxID;
                  this.OnTaxChange(this.inventoryList[index].taxID, i);
                }
              
              }
            }            
          }
        }
      }
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.Loading = false;
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  BindOrderDetailByID() {
    // this.AgLoad = false;
    this.Mode = "List";
    this.purchaseOrderService.getPurchaseOrderByID(this.PurchaseOrderID).subscribe((resp: any) => {

      this.PurchaseOrderDetail = resp.data.purchaseDetails;
      this.RowData = resp.data.purchaseDetails;
      // this.AgLoad = true;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //bind unit of measure
  BindUOMForNonINV() {
    this.sysCommonService.getLookupByID(GenricTableIDByName.LBS_INV_UnitOfMeasure).subscribe((resp: any) => {
      this.UOMList = resp.data.tabledata;


    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  //To bind the data of all currency to the Grid.
  BindCurrency() {
    this.Mode = 'List';
    this.sysCommonService.getCurrency().subscribe((resp: any) => {

      this.Currency = resp.data.cuurency;
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindTax() {
    this.priceservice.getalltaxcode().subscribe((resp: any) => {

      this.TaxCode = resp.data.taxcode;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  BindRequisitions() {

    this.Mode = "List";
    this.Loading = true;
    this.requisitionservice.getrequisitions().subscribe((resp: any) => {

      this.Requisitions = resp.data.requisitions;
      this.Loading = false;

    }, (error) => {
      this.Loading = false;
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
    this.Loading = true;
    this.purchaseOrderDetailService.GetInventoryForPO(this.PurchaseOrderID).subscribe((resp: any) => {

      this.inventoryList = resp.data.productkits;
      console.log(this.inventoryList)
      //this.RowData = resp.data.inventory;
      // this.AgLoad = true;
      this.Loading = false;

    }, (error) => {
      this.Loading = false;
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
  UpdatePurchaseStatus(Status) {
    this.UpdateStatus();
    this.OnUpdatePurchaseStatus.emit(Status)
  }
  getValidVendorPriceSchemeBYProductID(ID, i) {

    this.purchaseOrderDetailService.getValidVendorPriceSchemeBYProductID(this.PurchaseOrderID, ID).subscribe((resp: any) => {
      // console.log(resp.data.purchasematrix[0].supplierUnitPrice);

      if (resp.data.purchasematrix.length > 0) {
        this.BindUnitcostwhenchangeUOM = resp.data.purchasematrix[0].supplierUnitPrice.toFixed(Math.max(((resp.data.purchasematrix[0].supplierUnitPrice + '').split(".")).length, 2));
        if (this.BindUnitcostwhenchangeUOM == null || this.BindUnitcostwhenchangeUOM == undefined) {
          this.RowData[i].unitCost = 0;
        }
        else {
          this.RowData[i].unitCost = this.BindUnitcostwhenchangeUOM;
        }
        this.RowData[i].vendorPriceSchemeID = resp.data.purchasematrix[0].id;
        //.RowData[i].unitCost = resp.data.purchasematrix[0].supplierUnitPrice.toFixed(Math.max(((resp.data.purchasematrix[0].supplierUnitPrice+'').split(".")).length, 2));
        //this.RowData[i].discountType = resp.data.purchasematrix[0].discountType

        if (resp.data.purchasematrix[0].discountType == true) {
          this.RowData[i].discountType = 'true';
        }
        else {
          this.RowData[i].discountType = 'false';
        }
        this.BindVenderschemeIdOnChanheUOM = resp.data.purchasematrix[0].id;
        this.RowData[i].discountAmount = resp.data.purchasematrix[0].discountValue;
        if (this.RowData[i].discountAmount == null) {
          this.RowData[i].discountAmount = 0;
        }
        this.OnfxRateChange(i);
      } else {
        this.RowData[i].unitCost = 0;
        this.RowData[i].vendorPriceSchemeID = null;
        this.RowData[i].discountAmount = 0;
      }
      // this.inventoryList = resp.data.productkits;
      //this.RowData = resp.data.inventory;
      // this.AgLoad = true;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  getvalidVenderSKU(ID, i) {
    this.purchaseOrderDetailService.getValidVendorSKUBYProductID(this.PurchaseOrderID, ID).subscribe((resp: any) => {
      console.log(resp);
      if (resp.data.purchasematrix.length > 0) {
        this.RowData[i].supplierSKU = resp.data.purchasematrix[0].vendorSKU;
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onProductChange(id, i) {
    //let unitCost = 0;
    this.OnchangeproductID = id;
    this.purchaseOrderService.checkVenderpurchased(this.VendorID, id).subscribe((resp: any) => {
      if (resp.isSuccess) {
        if (confirm(resp.message)) {
          let des = "";
          if (id != "-1" && id) {
            this.BindInventoryUOMConversions(id, i);
            this.getValidVendorPriceSchemeBYProductID(id, i);
            this.getvalidVenderSKU(id, i);
            let index = this.inventoryList.findIndex(c => c.id == id);
            if (index >= 0) {
              //this.RowData[i].unitCost = this.inventoryList[index].inventoryDefaultCost; 
              this.RowData[i].productDescription = this.inventoryList[index].productName;
              this.RowData[i].taxID = this.inventoryList[index].taxID;
              this.RowData[i].unitOfMeasure = this.inventoryList[index].unitOfMeasureID;
              this.OnTaxChange(this.inventoryList[index].taxID, i);
              this.onUOMChange(i, this.RowData[i].unitOfMeasure);
            }
          }
        } else {
          // Do nothing!
          this.Deleteindex(i);
        }
      }

      else {
        let des = "";
        if (id != "-1" && id) {
          this.BindInventoryUOMConversions(id, i);
          this.getValidVendorPriceSchemeBYProductID(id, i);
          this.getvalidVenderSKU(id, i);


          let index = this.inventoryList.findIndex(c => c.id == id);
          if (index >= 0) {
            //this.RowData[i].unitCost = this.inventoryList[index].inventoryDefaultCost; 
            this.RowData[i].productDescription = this.inventoryList[index].productName;
            this.RowData[i].taxID = this.inventoryList[index].taxID;
            this.RowData[i].unitOfMeasure = this.inventoryList[index].unitOfMeasureID;
            this.OnTaxChange(this.inventoryList[index].taxID, i);
            this.onUOMChange(i, this.RowData[i].unitOfMeasure);
          }
        }
      }
      //this.confirmation.ConfirmationPopup(resp.message);

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });

    // let des = "";
    // if (id != "-1" && id) {
    //   this.BindInventoryUOMConversions(id, i);
    //   this.getValidVendorPriceSchemeBYProductID(id, i);
    //   this.getvalidVenderSKU(id,i);


    //   let index = this.inventoryList.findIndex(c => c.id == id);
    //   if (index >= 0) {
    //     //this.RowData[i].unitCost = this.inventoryList[index].inventoryDefaultCost; 
    //     this.RowData[i].productDescription = this.inventoryList[index].productName;
    //     this.RowData[i].taxID = this.inventoryList[index].taxID;
    //     this.RowData[i].unitOfMeasure = this.inventoryList[index].unitOfMeasureID;
    //     this.OnTaxChange(this.inventoryList[index].taxID, i); 
    //     this.onUOMChange(i,this.RowData[i].unitOfMeasure);
    //   }
    // }
    /*  this.PurchaseOrderDetailForm.patchValue({
       UnitCost: unitCost,
       ProductDescription:des
     });
  */
  }
  /*  BindIAllConversions(InventoryID) {
     this.UOMList = [];
     this.sysCommonService.getUOMConvertionsByInventryID(InventoryID).subscribe((resp: any) => {
       this.UOMList = resp.data.inventoryunitofmeasure;
     }, (error) => {
       //console.error('Problem with the sevice. Please try later : ' + error);
     });
   } */

  AddNewPurchaseDetail() {
    let object = {
      'companyID': this.CompanyID,
      'allowPartialReceiving': true,
      'classificationID': null,
      'convertedOrderedQuantity': 0,
      'covertedReceivedQuantity': 0,
      'createdBY': localStorage.getItem('LoginID'),
      'currencyID': this.SelectedCurrencyID,
      'dateCreated': new Date(),
      'discountAmount': 0,
      'discountType': true,
      'discountedUnitCost': 0,
      'discountedUnitCostForeign': 0,
      'discountedUnitCostHome': 0,
      'foreignExchangeUnitCost': 0,
      'fxRate': this.ForeignExchangeRate,
      'homeConvertedUnitCost': 0,
      'homeUnitCost': 0,
      'id': null,
      'lineNo': 0,
      'lineTotalCostTaxEclusive': 0,
      'lineTotalCostTaxExclusiveHome': 0,
      'lineTotalCostTaxInclusive': 0,
      'lineTotalCostTaxInclusiveHome': 0,
      'lineTotalForeignAmount': 0,
      'lineTotalForeignExchangeCostTaxExclusive': 0,
      'lineTotalForeignExchangeCostTaxInclusive': 0,
      'lineTotalForeignExchangeTaxAmount': 0,
      'lineTotalHomeAmount': 0,
      'lineTotalTaxAmount': 0,
      'lineTotalTaxAmountHome': 0,
      'orderedQuantity': 0,
      'productDescription': "",
      'productID': '00000000-0000-0000-0000-000000000000',
      'productName': "",
      'productStyleMatrixEnabled': false,
      'productType': "INV",
      'purchaseLineStatus': "",
      'purchaseOrderID': this.PurchaseOrderID,
      'receivedQuantity': 0,
      'requisitionID': null,
      'serialisedProduct': true,
      'supplierSKU': null,
      'taxID': null,
      'taxRate': 0,
      'uomlist': null,
      'unitCost': 0,
      'unitOfMeasure': "00000000-0000-0000-0000-000000000000",
      'uom': '00000000-0000-0000-0000-000000000000',
      'vendorPriceSchemeID': null,
    }
    console.log(object);

    this.RowData.push(object);
  }

  UpdateStatus() {
    let index = this.RowData.findIndex(c => c.unitOfMeasure == '00000000-0000-0000-0000-000000000000' && c.productType != 'Com');
    if (index >= 0) {
      this.toastr.warning('Unit of Measure needs to be selected');
      return;
    }

    this.purchaseOrderDetailService.addPurchaseMainDetailList(this.RowData).subscribe((resp: any) => {

      this.toastr.success('Details updated successfully');
      this.RefreshMaingrid.emit('');
      this.BindAllOrderDetail();
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onOptionSelected(index, event, Status) {

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
  checkAll(event, Status) {

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
  Deleteindex(i) {
    this.RowData.splice(i, 1);
  }
  DeletepurchaseOrderDetail(ID) {
    this.Loading = true;
    this.deleteRecordsService.deleteRecordsBYID(ID, 'LBS_PUR_PurchaseDetails', localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.purchaseOrderDetailService.DeleteRowDetail(ID).subscribe((resp: any) => {
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error);
      });
      this.BindAllOrderDetail();
    })

    
  }
  // InventoryUnitOfMeasure
  BindInventoryUOMConversions(InventoryID, i) {
    //this.InventoryUnitOfMeasure = [];
    this.sysCommonService.getUOMConvertionsByInventryID(InventoryID).subscribe((resp: any) => {
      //this.InventoryUnitOfMeasure = resp.data.inventoryunitofmeasure;

      this.RowData[i].uomlist = resp.data.inventoryunitofmeasure;
      //this.onUOMChange(i);
      this.OnquantityChange(i);

    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  InventoryUOMConversions(InventoryID, i) {
    this.Loading = true;
    //this.InventoryUnitOfMeasure = [];
    this.sysCommonService.getUOMConvertionsByInventryID(InventoryID).subscribe((resp: any) => {
      //this.InventoryUnitOfMeasure = resp.data.inventoryunitofmeasure;
      this.RowData[i].uomlist = resp.data.inventoryunitofmeasure;
      //this.onUOMChange(i);
      this.Loading = false;


    }, (error) => {
      this.Loading = false;

      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  productTypeStatus(value, i) {
    if (value == "INV") {

    }
    else {
      this.IsInventory = false;
      this.RowData[i].productDescription = '';
      this.RowData[i].productID = '00000000-0000-0000-0000-000000000000';
    }
  }
  OnquantityChange(i) {

    let quantity = this.RowData[i].orderedQuantity;
    let uid = this.RowData[i].unitOfMeasure;
    let index2 = -1;
    if (this.RowData[i].uomlist) {
       index2 = this.RowData[i].uomlist.findIndex(c => c.uomidFrom == uid);
    } 
    let conqty = 0;
    if (index2 >= 0) {
      conqty = this.RowData[i].uomlist[index2].conversionRatio;
    }
    if (conqty == 0) {
      conqty = 1;
    }
    var quan = Number(quantity) * conqty;
    this.RowData[i].convertedOrderedQuantity = quan.toFixed(Math.max(((quan + '').split(".")).length, 2));
    this.OnchangeHomeConvertedUnitCost(i);
    this.ForLineTotalCostTaxEclusive(i);
    this.forForeignExchangeCostTaxExclusive(i);
    this.OnfxRateChange(i);

  }
  onUOMChange(i, ID) {
    this.OnquantityChange(i);

    //this.BindUnitcostwhenchangeUOM=resp.data.purchasematrix[0].supplierUnitPrice.toFixed(Math.max(((resp.data.purchasematrix[0].supplierUnitPrice+'').split(".")).length, 2));

    // if( this.BindUnitcostwhenchangeUOM==null ||this.BindUnitcostwhenchangeUOM==undefined )
    // {
    //   this.RowData[i].unitCost=0;
    // }
    // else{
    //   this.RowData[i].unitCost = this.BindUnitcostwhenchangeUOM;
    // }
    ////this.RowData[i].vendorPriceSchemeID = this.BindVenderschemeIdOnChanheUOM;
    this.getvenderbyuom(i, ID)
  }
  getvenderbyuom(i, UOMID) {

    if (this.OnchangeproductID == null || this.OnchangeproductID == undefined) {
      this.OnchangeproductID = this.RowData[i].productID
    }
    else {
      this.OnchangeproductID = this.OnchangeproductID;
    }
    this.purchaseOrderDetailService.getVendorPriceSchemeBYUOMID(this.PurchaseOrderID, this.OnchangeproductID, UOMID).subscribe((resp: any) => {
      // console.log(resp.data.purchasematrix[0].supplierUnitPrice);
      if (resp.data.vender.length > 0) {
        this.RowData[i].vendorPriceSchemeID = resp.data.vender[0].id;
        this.RowData[i].unitCost = resp.data.vender[0].supplierUnitPrice;

      }
      else {
        this.RowData[i].unitCost = 0;
        this.RowData[i].vendorPriceSchemeID = null;
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  OnfxRateChange(i) {
    let fxRate = this.RowData[i].fxRate;
    if (this.RowData[i].fxRate == null || this.RowData[i].fxRate == '') {
      fxRate = 0;
    }

    let UnitCost = this.RowData[i].unitCost;
    let HomeUnitCost = Number(Number(fxRate) * Number(UnitCost))
    this.RowData[i].homeUnitCost = HomeUnitCost.toFixed(4);
    this.OndiscountAmountChange(i);
    this.OnchangeHomeConvertedUnitCost(i);

  }

  OnchangeHomeConvertedUnitCost(i) {

    function ConvertStringToNumber(input: string) {
      var numeric = Number(input);
      return numeric;
    }

    //   let TaxID = this.RowData[i].taxID;
    //   let index = this.TaxCode.findIndex(c => c.id == TaxID);
    //   let OrderedQuantity = ConvertStringToNumber(this.RowData[i].orderedQuantity);
    //   // OrderedQuantity=Number(OrderedQuantity).toFixed(4);
    //   let HomeUnitCost = ConvertStringToNumber(this.RowData[i].discountedUnitCostHome);
    //   //HomeUnitCost=Number(HomeUnitCost).toFixed(4);

    //   let ConvertedOrderedQuantity = ConvertStringToNumber(this.RowData[i].convertedOrderedQuantity);
    //   //  ConvertedOrderedQuantity=Number(ConvertedOrderedQuantity).toFixed(4);
    //  // ConvertedOrderedQuantity=ConvertedOrderedQuantity+1
    //  let homeCost = (Number(OrderedQuantity) * Number(HomeUnitCost)); 
    //  let homeConvertedUnitCost;
    //  if (Number(ConvertedOrderedQuantity) > 0) {
    //     homeConvertedUnitCost = Number(homeCost / Number(ConvertedOrderedQuantity));

    //    if (isNaN(Number(homeConvertedUnitCost)) ||homeConvertedUnitCost==Infinity || homeConvertedUnitCost==-Infinity) {
    //     homeConvertedUnitCost = 0;
    //    }

    //  }
    // if (this.RowData[i].discountType == "true" || this.RowData[i].discountType == 1) {
    //   if(homeConvertedUnitCost){
    //     this.RowData[i].homeConvertedUnitCost = Number(homeConvertedUnitCost).toFixed(4);
    //   }else{
    //     this.RowData[i].homeConvertedUnitCost =0;
    //   }

    //   /* let homeCost = (Number(OrderedQuantity) * Number(HomeUnitCost)); 
    //   if (Number(ConvertedOrderedQuantity) > 0) {
    //     let homeConvertedUnitCost = Number(homeCost / Number(ConvertedOrderedQuantity));

    //     if (isNaN(Number(homeConvertedUnitCost)) ||homeConvertedUnitCost==Infinity || homeConvertedUnitCost==-Infinity) {
    //       this.RowData[i].homeConvertedUnitCost = 0;
    //     }
    //     else {
    //       this.RowData[i].homeConvertedUnitCost = Number(homeConvertedUnitCost).toFixed(4);
    //     }
    //   } */
    // }
    //////  New Logic for TaxIN taxEX


    let TaxID = this.RowData[i].taxID;
    let TaxRate = Number(this.RowData[i].taxRate);
    if (TaxRate == 0) {
      TaxRate = 1;
    }
    TaxRate = TaxRate * 0.01;
    let index = this.TaxCode.findIndex(c => c.id == TaxID);
    let DiscountedUnitCostHome = Number(this.RowData[i].discountedUnitCostHome);
    let OrderedQty = Number(this.RowData[i].orderedQuantity);
    let ConvertedOrderedQuantity = Number(this.RowData[i].convertedOrderedQuantity);
    if (index != "-1") {

      if (this.TaxCode[index].taxInclusiveExclusiveFlag) {
        let calculateinclusiveTax = ((DiscountedUnitCostHome * OrderedQty) / ConvertedOrderedQuantity) / (1 + TaxRate);

        if (isNaN(Number(calculateinclusiveTax)) || calculateinclusiveTax == Infinity || calculateinclusiveTax == -Infinity) {
          this.RowData[i].homeConvertedUnitCost = 0;
        }
        else {
          this.RowData[i].homeConvertedUnitCost = calculateinclusiveTax.toFixed(4);
        }

      }
      else {
        let CalculateTotalExclusiveTax = (DiscountedUnitCostHome * OrderedQty) / ConvertedOrderedQuantity;

        if (isNaN(Number(CalculateTotalExclusiveTax)) || CalculateTotalExclusiveTax == Infinity || CalculateTotalExclusiveTax == -Infinity) {
          this.RowData[i].homeConvertedUnitCost = 0;
        }
        else {
          this.RowData[i].homeConvertedUnitCost = CalculateTotalExclusiveTax.toFixed(4);
        }

      }

    }

    /* if (index != "-1") {
      if (!this.TaxCode[index].taxInclusiveExclusiveFlag) {
        let homeCost = (Number(OrderedQuantity) * Number(HomeUnitCost)); 
        if (Number(ConvertedOrderedQuantity) > 0) {
          let homeConvertedUnitCost = Number(homeCost / Number(ConvertedOrderedQuantity));
         
          if (isNaN(Number(homeConvertedUnitCost)) ||homeConvertedUnitCost==Infinity || homeConvertedUnitCost==-Infinity) {
            this.RowData[i].homeConvertedUnitCost = 0;
          }
          else {
            this.RowData[i].homeConvertedUnitCost = Number(homeConvertedUnitCost).toFixed(4);
          }
         
        }
      } else {
        let taxRate = ConvertStringToNumber(this.RowData[i].taxRate);
        let a = Number(OrderedQuantity) * Number(HomeUnitCost);
        let b = Number(a) / Number(ConvertedOrderedQuantity);
       // b=1+b;
        let T = Number(taxRate) / 100;
        T = 1 + T;
        let res = Number(b) / Number(T) 
        if (isNaN(Number(res))||res==Infinity || res==-Infinity) {
          this.RowData[i].homeConvertedUnitCost = 0;
        }
        else {
          this.RowData[i].homeConvertedUnitCost = Number(res).toFixed(4);
        }
        
      }
    } */
  }

  OndiscountAmountChange(i) {

    let discountAmount = this.RowData[i].discountAmount;
    let HomeUnitCost = this.RowData[i].homeUnitCost;
    if (this.RowData[i].discountType == "true" || this.RowData[i].discountType == 1) {
      let per = ((HomeUnitCost / 100) * discountAmount).toFixed(4)
      let discountedUnitCostHome = Number(Number(HomeUnitCost) - Number(per)).toFixed(4);

      let UnitCost = this.RowData[i].unitCost;
      let per2 = ((UnitCost / 100) * discountAmount).toFixed(4);
      let discountedUnitCostForeign = Number(Number(UnitCost) - Number(per2)).toFixed(4);

      this.RowData[i].discountedUnitCostHome = discountedUnitCostHome;
      this.RowData[i].discountedUnitCostForeign = discountedUnitCostForeign;
      this.ForLineTotalCostTaxEclusive(i);
      this.forForeignExchangeCostTaxExclusive(i)
    } else {

      let fxRate = this.RowData[i].fxRate;
      //let per = Number(Number(fxRate) * Number(discountAmount)).toFixed(4)
      let discountedUnitCostHome = Number(Number(HomeUnitCost) - Number(discountAmount)).toFixed(4);
      this.RowData[i].discountedUnitCostHome = discountedUnitCostHome;
      let UnitCost = this.RowData[i].unitCost;
      let discountedUnitCostForeign = Number(Number(UnitCost) - Number(discountAmount)).toFixed(4);
      this.RowData[i].discountedUnitCostForeign = discountedUnitCostForeign;
      this.ForLineTotalCostTaxEclusive(i);
      this.forForeignExchangeCostTaxExclusive(i)
    }
    this.OnchangeHomeConvertedUnitCost(i);
  }
  ForLineTotalCostTaxEclusive(i) {
    let discountedUnitCostHome = this.RowData[i].discountedUnitCostHome;
    let OrderedQuantity = this.RowData[i].orderedQuantity;
    let TaxID = this.RowData[i].taxID;
    let index = this.TaxCode.findIndex(c => c.id == TaxID);
    if (index != "-1") {
      if (!this.TaxCode[index].taxInclusiveExclusiveFlag) {
        let lineTotalCostTaxEclusive = Number((OrderedQuantity * discountedUnitCostHome)).toFixed(4);
        this.RowData[i].lineTotalCostTaxEclusive = lineTotalCostTaxEclusive;
        this.ForLineTotalTaxAmount(i);
        this.forLineTotalCostTaxInclusive(i);
      } else {
        this.ForLineTotalTaxAmount(i);
        this.forLineTotalCostTaxInclusive(i);
        let lineTotalCostTaxInclusive = this.RowData[i].lineTotalCostTaxInclusive;
        let lineTotalTaxAmount = this.RowData[i].lineTotalTaxAmount;
        let lineTotalCostTaxEclusive = Number((lineTotalCostTaxInclusive - lineTotalTaxAmount)).toFixed(4);
        this.RowData[i].lineTotalCostTaxEclusive = lineTotalCostTaxEclusive;
      }
    }
    /* if (this.RowData[i].discountType == "true" || this.RowData[i].discountType == 1) {
      let lineTotalCostTaxEclusive = Number((OrderedQuantity * discountedUnitCostHome)).toFixed(4);
      this.RowData[i].lineTotalCostTaxEclusive = lineTotalCostTaxEclusive;
      this.ForLineTotalTaxAmount(i);
      this.forLineTotalCostTaxInclusive(i);
    } else {
      this.ForLineTotalTaxAmount(i);
      this.forLineTotalCostTaxInclusive(i);
      let lineTotalCostTaxInclusive = this.RowData[i].lineTotalCostTaxInclusive;
      let lineTotalTaxAmount = this.RowData[i].lineTotalTaxAmount;
      let lineTotalCostTaxEclusive = Number((lineTotalCostTaxInclusive - lineTotalTaxAmount)).toFixed(4);
      this.RowData[i].lineTotalCostTaxEclusive = lineTotalCostTaxEclusive;
    } */


  }
  ForLineTotalTaxAmount(i) {
    let TaxRate = this.RowData[i].taxRate;
    let LineTotalCostTaxEclusive = this.RowData[i].lineTotalCostTaxEclusive;
    let TaxID = this.RowData[i].taxID;
    let index = this.TaxCode.findIndex(c => c.id == TaxID);
    if (index != "-1") {

      if (!this.TaxCode[index].taxInclusiveExclusiveFlag) {
        let per = ((LineTotalCostTaxEclusive / 100) * TaxRate).toFixed(4);
        let ForExcCostTaxEx = this.RowData[i].lineTotalForeignExchangeCostTaxExclusive;
        let per2 = ((ForExcCostTaxEx / 100) * TaxRate).toFixed(4);
        this.RowData[i].lineTotalTaxAmount = Number(per).toFixed(4);;
        this.RowData[i].lineTotalForeignExchangeTaxAmount = Number(per2).toFixed(4);;
        this.forLineTotalCostTaxInclusive(i);
        this.ForLineTotalForeignExchangeCostTaxInclusive(i);
      }
      else {
        this.forLineTotalCostTaxInclusive(i);
        this.ForLineTotalForeignExchangeCostTaxInclusive(i);
        /*  let InsuranceTaxID = this.RowData[i].taxID;
       let index = this.TaxCode.findIndex(c => c.id == InsuranceTaxID);
        
       if(index=="-1"){
         return;
       }
       if (!this.TaxCode[index].taxInclusiveExclusiveFlag) {
   let InsuranceTaxRate=0;
        let res3 = Number((InsuranceTaxRate / 100) * 2).toFixed(4)
         this.RowData[i].lineTotalForeignExchangeTaxAmount =  Number(res3).toFixed(4);;
       }  */
        let TR = Number(this.RowData[i].taxRate) / 100;
        TR = 1 + TR;
        let lineTotalCostTaxInclusive = this.RowData[i].lineTotalCostTaxInclusive;
        let A = Number(lineTotalCostTaxInclusive) / Number(TR);
        let res = Number(lineTotalCostTaxInclusive) - A;
        this.RowData[i].lineTotalTaxAmount = Number(res).toFixed(4);

        let lineTotfTaxInclusive = this.RowData[i].lineTotalCostTaxInclusive;
        let B = Number(lineTotfTaxInclusive) / Number(TR);
        let res2 = Number(lineTotfTaxInclusive) - B;
        this.RowData[i].lineTotalForeignExchangeTaxAmount = Number(res2).toFixed(4);;
      }
    }
  }


  forLineTotalCostTaxInclusive(i) {
    let LineTotalTaxAmount = this.RowData[i].lineTotalTaxAmount;
    let LineTotalCostTaxEclusive = this.RowData[i].lineTotalCostTaxEclusive;

    let TaxID = this.RowData[i].taxID;
    let index = this.TaxCode.findIndex(c => c.id == TaxID);
    if (index != "-1") {
      if (!this.TaxCode[index].taxInclusiveExclusiveFlag) {
        let TaxInclusive = Number(Number(LineTotalCostTaxEclusive) + Number(LineTotalTaxAmount)).toFixed(4);
        this.RowData[i].lineTotalCostTaxInclusive = Number(TaxInclusive).toFixed(4);
      } else {
        let orderedQuantity = this.RowData[i].orderedQuantity;
        let discountedUnitCostHome = this.RowData[i].discountedUnitCostHome;
        let res = Number(orderedQuantity) * Number(discountedUnitCostHome);
        this.RowData[i].lineTotalCostTaxInclusive = Number(res).toFixed(4);
      }
    }
  }
  forForeignExchangeCostTaxExclusive(i) {
    let quantity = this.RowData[i].orderedQuantity;
    let DiscountedUnitCostForeign = this.RowData[i].discountedUnitCostForeign;
    let DiscountedUnitCostHome = this.RowData[i].discountedUnitCostHome;
    let lineTotalCostTaxEclusive = (DiscountedUnitCostHome * quantity).toFixed(4);
    let forExcCostTaxEx = Number(Number(DiscountedUnitCostForeign) * Number(quantity)).toFixed(4);
    // if (this.RowData[i].discountType == "true" || this.RowData[i].discountType == 1) {

    let TaxID = this.RowData[i].taxID;
    let index = this.TaxCode.findIndex(c => c.id == TaxID);
    if (index != "-1") {
      if (!this.TaxCode[index].taxInclusiveExclusiveFlag) {
        this.RowData[i].lineTotalCostTaxEclusive = lineTotalCostTaxEclusive;
        this.RowData[i].lineTotalForeignExchangeCostTaxExclusive = forExcCostTaxEx;
        this.ForLineTotalTaxAmount(i);
        this.ForLineTotalForeignExchangeCostTaxInclusive(i);
      } else {
        this.ForLineTotalTaxAmount(i);
        this.ForLineTotalForeignExchangeCostTaxInclusive(i);
        let lineTotalCostTaxInclusive = this.RowData[i].lineTotalCostTaxInclusive;
        let lineTotalTaxAmount = this.RowData[i].lineTotalTaxAmount;
        let lineTotalCostTaxEclusive = Number((lineTotalCostTaxInclusive - lineTotalTaxAmount)).toFixed(4);
        this.RowData[i].lineTotalCostTaxEclusive = lineTotalCostTaxEclusive;
        let LInclusive = this.RowData[i].lineTotalForeignExchangeCostTaxInclusive;
        let lTaxAmount = this.RowData[i].lineTotalForeignExchangeTaxAmount;
        let res = Number(LInclusive) - Number(lTaxAmount)
        this.RowData[i].lineTotalForeignExchangeCostTaxExclusive = Number(res).toFixed(4);
      }
    }

  }
  ForLineTotalForeignExchangeCostTaxInclusive(i) {
    let val = this.RowData[i].lineTotalForeignExchangeCostTaxExclusive
    let LineTAmount = this.RowData[i].lineTotalForeignExchangeTaxAmount;
    //if (this.RowData[i].discountType == "true" || this.RowData[i].discountType == 1) {
    let TaxID = this.RowData[i].taxID;
    let index = this.TaxCode.findIndex(c => c.id == TaxID);
    if (index != "-1") {
      if (!this.TaxCode[index].taxInclusiveExclusiveFlag) {
        let per2 = Number(Number(LineTAmount) + Number(val)).toFixed(4);
        this.RowData[i].lineTotalForeignExchangeCostTaxInclusive = per2;
      } else {
        let DiscountedUnitCostForeign = this.RowData[i].discountedUnitCostForeign;
        let quantity = this.RowData[i].orderedQuantity;
        let res = Number(Number(DiscountedUnitCostForeign) * Number(quantity)).toFixed(4);
        this.RowData[i].lineTotalForeignExchangeCostTaxInclusive = res;
      }
    }
  }

  SelectedRequisitionID: any;
  ProductID: any;
  SelectedPurchaseDetail_ID: any;
  SelectedWharehouseID: any;
  SelectedQuantity: any;
  ProductMatrix(matrix: TemplateRef<any>, i) {

    this.ProductID = this.RowData[i].productID;
    this.SelectedPurchaseDetail_ID = this.RowData[i].id;
    this.SelectedQuantity = this.RowData[i].receivedQuantity;
    this.modalRef = this.modalService.show(matrix);
  }
  Closenote() {
    this.modalRef.hide();
    this.BindAllOrderDetail();
  }
  onlyNumberKey(event) {
    return (event.charCode === 8 || event.charCode == 0) ? null : event.charCode >= 46 && event.charCode <= 57;
  }
  OnTaxChange(value, i) {
    if (value == '-1' || value == null || !value) {
      this.RowData[i].taxRate = 0;
      return;
    }
    this.purchaseOrderService.GetTaxTotalRateByTaxid(value).subscribe((resp: any) => {
      if (resp.isSuccess == true) {
        let taxtotal = 0;
        if (resp.data.taxtotal) {
          taxtotal = resp.data.taxtotal;
        }
        this.RowData[i].taxRate = taxtotal
        this.OnfxRateChange(i);
      }

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }
  Isreject: boolean;
  UpdateStatusChanges() {

    let New = this.RowData.find(ob => ob['purchaseLineStatus'] === 'New' || ob['purchaseLineStatus'] === '');
    let Rejected = this.RowData.find(ob => ob['purchaseLineStatus'] === 'Rejected');
    let Approved = this.RowData.find(ob => ob['purchaseLineStatus'] === 'Approved');

    if (!Approved && !Rejected) {
      this.toastr.warning('please select atlest one record to approve or reject')
      return;
    }

    if (!Approved && !Rejected) {
      this.toastr.warning('please select atlest one record to approve or reject')
      return;
    }
    if (New) {
      this.toastr.warning('please select all approve or reject')
      return;
    }

    let Isreject =true;
    for (let i = 0; i <= this.RowData.length - 1; i++) {
      if (this.RowData[i].purchaseLineStatus == 'Approved') {
        Isreject = false;
      }
    }
    let StatusID;
    if (Isreject) {
      StatusID = "6";
    } else {
      StatusID = "5";
    }
    this.UpdateStatus();
    this.OnUpdatePurchaseStatus.emit(StatusID)
  }
  /* twoDecimalnumber(i,val){
    let bb=""
    this.RowData[i].bb =Number(val).toFixed(2);
  } */

  OnChangeUnitCost(Value, vendorPriceSchemeID, unitOfMeasure, i) {

    if (vendorPriceSchemeID != null && vendorPriceSchemeID != "-1" && vendorPriceSchemeID != undefined) {
      this.OnchangeUnitCostValue = Value;
      this.OnchangeUnitCostIndex = i;
      if (this.OnchangeproductID != null || this.OnchangeproductID != undefined) {
        this.getvenderbyuom(i, unitOfMeasure)
      }
      this.confirmation.ConfirmationPopup('Unit Cost entered does not match the active Vendor Price Scheme. System will remove the Price Scheme. Do you want to continue?');

    }
    else {
      if (this.OnchangeproductID != null || this.OnchangeproductID != undefined) {
        this.RowData[i].unitCost = Value;
      }
    }

  }
  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
  OnAccept($event) {
    this.RowData[this.OnchangeUnitCostIndex].unitCost = this.OnchangeUnitCostValue;

  }

  CostView(costview: TemplateRef<any>, i) {

    this.purchaseOrderDetailService.Costview(this.RowData[i].productID).subscribe((resp: any) => {

      this.CostViewData = resp.data.costview;
      this.modalRef = this.modalService.show(costview);
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }
}

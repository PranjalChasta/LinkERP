import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LBSPURLandedCostShipmentLines } from 'src/app/models/pur/lbs-pur-landed-cost-shipment-lines';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { EnumExtension } from 'src/app/shared/enums/enum-extension';
import { LandedCostShipmentLines } from 'src/app/shared/enums/landed-cost-shipment-lines.enum';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { CustomValidators } from 'ngx-custom-validators';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { PriceGroupsService } from 'src/app/inv/services/price-groups.service';
import { LandedCostShipmentLinesService } from '../../services/landed-cost-shipment-lines.service';
import { PurCommonService } from '../../services/pur-common.service';

@Component({
  selector: 'app-landed-cost-shipment-lines',
  templateUrl: './landed-cost-shipment-lines.component.html',
  styleUrls: ['./landed-cost-shipment-lines.component.css']
})
export class LandedCostShipmentLinesComponent implements OnInit {
  @Input() CostID: any;
  @Input() WarehouseID: any;
  @Input() Status: any;
  @Output() activeStockBookedInTab = new EventEmitter();
  @Output() cancleButtonClick = new EventEmitter();

  Submitted: any = false;
  CompanyID = localStorage.getItem('CompanyID');
  RowData: any;
  AgLoad: boolean = false;
  Loading: any = false;
  LandedCostList: any;
  InvoiceNumbersList: any;
  PurchaseOrdersList: any;
  PurchaseOrdersLineList: any;
  TaxList: any;
  LandedCostShipmentForm: FormGroup
  ShipmentLineDetails: any;
  ColumnDefs;
  IsProductType: boolean;
  addreadonly: boolean;
  TaxAmount: any;
  TaxRate: any;
  TaxCodeID: any;
  ProductList: any;
  modalRef: BsModalRef;
  IsActive: boolean;
  PageSize: any;
  Currentpage: string;
  constructor(
    private toastr: ToastrService,
    private FB: FormBuilder,
    private landedCostShipmentLinesService: LandedCostShipmentLinesService,
    public modalService: BsModalService
  ) { }

  ngOnInit() {
    this.CreateForm();
    this.BindLandedCostShipmentLines();
    //this.productType = EnumExtension.getNamesAndValuestring(LandedCostShipmentLines);
  }

  //To Create a Form
  CreateForm() {
    this.LandedCostShipmentForm = this.FB.group({
      ShipmentOrder: this.FB.array([])
    });
  }

  get f() { return this.LandedCostShipmentForm.controls; }
  get ShipmentOrder(): FormArray {
    return this.LandedCostShipmentForm.get('ShipmentOrder') as FormArray;
  }
  setShipmentOrder(shipmentOrder: any[]): FormArray {
    const shipmentOrderArray = new FormArray([]);
    shipmentOrder.forEach(a => {
      shipmentOrderArray.push(this.FB.group({
        ShipmentLineID: a.id,
        PurchaseOrderID: a.purchaseOrderID,
        PurchaseLandedCostID: a.purchaseLandedCostID,
        PurchaseOrderLineID: a.purchaseOrderLineID,
        CompanyID: a.companyID,
        Description: a.description,
        ForeignCurrency: a.foreignCurrency,
        ForeignExchangeRate: a.fxRate,
        PurchaseOrderNumber: a.purchaseOrderNumber,
        ProductName: a.productName,
        ProductType: a.productType,
        ProductID: a.productID,
        ProductCode: a.productCode,
        UseSerialNo: a.useSerialNo,
        UseExpiry: a.useExpiry,
        Weight: a.weight,
        Volume: a.volume,
        VendorID: a.vendorID,
        CurrencyID: a.currencyID,
        VendorName: a.vendorAccountName,
        VendorCode: a.vendorCode,
        Currency: a.currencyName ? a.currencyName : '',
        ForeignLandedUnitTaxExclusive: a.lineTotalTaxExclusiveForeign,
        InvoicesNo: a.invoicesNumber ? a.invoicesNumber : '',
        LandedUnitCostTaxExclusiveHome: a.landedUnitCostTaxExclusiveHome,
        LineTotalLandedCostTaxExclusiveHome: a.lineTotalLandedCostTaxExclusiveHome,
        LineTotalTaxExclusiveForeign: a.lineTotalTaxExclusiveForeign,
        LineTotalTaxExclusiveHome: a.lineTotalTaxExclusiveHome,
        LineTotalTaxInclusiveForeign: a.lineTotalTaxInclusiveForeign,
        LineTotalTaxInclusiveHome: a.lineTotalTaxInclusiveHome,
        QuantityOrdered: a.quantityOrdered,
        QuantityReceivedThisShipment: a.quantityReceivedThisShipment,
        POLineNo: a.poLineNo ? a.poLineNo : '',
        ShipmentNumber: a.shipmentNumber ? a.shipmentNumber : '',
        UnitCostTaxInclusiveHome: a.landedUnitCostTaxExclusiveHome,
        ApportionedImportCosts: a.aportionedImportCosts
      }));
    })
    console.log(shipmentOrderArray);

    return shipmentOrderArray
  }
  // checkAll(selected) {
  //   if (selected.target.checked) {
  //     this.ShipmentOrder.controls.forEach(a => {
  //       a.patchValue({ SelectShipmentOrder: true });
  //     });
  //   }
  //   else {
  //     this.ShipmentOrder.controls.forEach(a => {
  //       a.patchValue({ SelectShipmentOrder: false });
  //     });
  //   }
  // }

  //To Bind the data of  Landed Cost Shipment Lines to the Grid
  BindLandedCostShipmentLines() {
    this.landedCostShipmentLinesService.getLandedCostShipment(this.CostID).subscribe((resp: any) => {
      console.log(resp);
      this.ShipmentLineDetails = resp.data.shipmentLines;
      if (this.ShipmentLineDetails.length !== 0) {
        this.LandedCostShipmentForm.setControl('ShipmentOrder', this.setShipmentOrder(this.ShipmentLineDetails));
      }
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  DeleteShipmentOrder(i, data) {

  }
  onQuantityChange($event, i) {

    let ShippedQty = $event.target.value;
    let OrderedQty = this.LandedCostShipmentForm.value.ShipmentOrder[i].QuantityOrdered;

    if (OrderedQty < ShippedQty) {
      this.toastr.warning("Ordered Quantity cannot be more than Shipped Quantity");
      this.ShipmentOrder.at(i).patchValue({ QuantityReceivedThisShipment: OrderedQty });
    }

  }

  Cancel() {
    this.cancleButtonClick.emit();
  }

  onSave() {
    this.Submitted = true;
    if (this.LandedCostShipmentForm.invalid) {
      return;
    }
    let ShipmentOrderList: LBSPURLandedCostShipmentLines[] = [];
    this.ShipmentOrder.controls.forEach(a => {
      let submitShipmentOrder: any = new LBSPURLandedCostShipmentLines();
      //let landedcost = new LBSPURLandedCostShipmentLines();
      submitShipmentOrder.CompanyID = this.CompanyID;
      submitShipmentOrder.PurchaseLandedCostID = a.get('PurchaseLandedCostID').value;
      submitShipmentOrder.PurchaseOrderID = a.get('PurchaseOrderID').value;
      submitShipmentOrder.PurchaseOrderLineID = a.get('PurchaseOrderLineID').value;
      //submitShipmentOrder.VendorID = a.get('VendorID').value;
      submitShipmentOrder.WarehouseID = this.WarehouseID;
      //submitShipmentOrder.InvoicesNumber = a.get('InvoicesNo').value;
      submitShipmentOrder.ProductType = a.get('ProductType').value;
      submitShipmentOrder.ProductID = a.get('ProductID').value;
      submitShipmentOrder.ProductCode = a.get('ProductCode').value;
      submitShipmentOrder.Description = a.get('Description').value;
      submitShipmentOrder.UseSerialNo = a.get('UseSerialNo').value;
      submitShipmentOrder.UseExpiry = a.get('UseExpiry').value;

      submitShipmentOrder.Weight = a.get('Weight').value ? a.get('Weight').value : 0;
      submitShipmentOrder.Volume = a.get('Volume').value ? a.get('Volume').value : 0;
      submitShipmentOrder.QuantityOrdered = a.get('QuantityOrdered').value;
      submitShipmentOrder.QuantityReceivedThisShipment = +a.get('QuantityReceivedThisShipment').value;
      submitShipmentOrder.LandedUnitCostTaxExclusiveHome = a.get('LandedUnitCostTaxExclusiveHome').value;
      //submitShipmentOrder.LineTotalForeignExchangeCostTaxExclusive = a.get('LineTotalForeignExchangeCostTaxExclusive').value;
      submitShipmentOrder.LineTotalTaxExclusiveHome = a.get('LineTotalTaxExclusiveHome').value;
      submitShipmentOrder.LineTotalLandedCostTaxExclusiveHome = a.get('LineTotalLandedCostTaxExclusiveHome').value;

      submitShipmentOrder.CreatedBy = localStorage.getItem('LoginID');
      submitShipmentOrder.ProductName = a.get('ProductName').value;
      submitShipmentOrder.ShipmentNumber = a.get('ShipmentNumber').value;
      submitShipmentOrder.ShipmentLineID = a.get('ShipmentLineID').value;
      ShipmentOrderList.push(submitShipmentOrder);

      // submitShipmentOrder.OrderedUnitCostTaxInclusiveHome = a.get('OrderedUnitCostTaxInclusiveHome').value;
      // submitShipmentOrder.OrderedUnitCostTaxExclusiveForeign = a.get('OrderedUnitCostTaxExclusiveForeign').value;
      // submitShipmentOrder.ForeignCurrency = a.get('ForeignCurrency').value;
      // submitShipmentOrder.ForeignExchangeRate = a.get('ForeignExchangeRate').value;
      // submitShipmentOrder.ForeignLandedUnitTaxExclusive = a.get('ForeignLandedUnitTaxExclusive').value;

      // submitShipmentOrder.TaxID = a.get('TaxID').value;
      // submitShipmentOrder.TaxRate = a.get('TaxRate').value;
      // submitShipmentOrder.LineTotalTaxAmount = a.get('LineTotalTaxAmount').value;
      // submitShipmentOrder.UnitCostTaxInclusiveHome = a.get('UnitCostTaxInclusiveHome').value;
      // submitShipmentOrder.LineTotalTaxExclusiveHome = a.get('LineTotalTaxExclusiveHome').value;
      // submitShipmentOrder.LineTotalTaxInclusiveHome = a.get('LineTotalTaxInclusiveHome').value;
      // submitShipmentOrder.LineTotalTaxExclusiveForeign = a.get('LineTotalTaxExclusiveForeign').value;
      // submitShipmentOrder.LineTotalTaxInclusiveForeign = a.get('LineTotalTaxInclusiveForeign').value;
      // submitShipmentOrder.ImportCosts = a.get('ImportCosts').value;
      // submitShipmentOrder.LineTotalLandedCostTaxExclusiveHome = a.get('LineTotalLandedCostTaxExclusiveHome').value;
      // submitShipmentOrder.ClassificationID = a.get('ClassificationID').value;

    });
    console.log(ShipmentOrderList);
    if (ShipmentOrderList.length != 0) {
      this.landedCostShipmentLinesService.submitShipmentOrder(ShipmentOrderList).subscribe((response) => {
        console.log(response);
        if (response) {
          this.toastr.success("Shipment Order has been submitted successfully");
          this.activeStockBookedInTab.emit();
        }
      })
    } else {
      this.toastr.warning("Please select shipment order checkbox");
    }

  }

}

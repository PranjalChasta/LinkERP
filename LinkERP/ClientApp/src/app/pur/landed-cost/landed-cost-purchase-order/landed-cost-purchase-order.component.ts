import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LandedCostService } from '../../services/landed-cost.service';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { LbsPurLandedCostPurchaseOrder } from 'src/app/models/pur/lbs-pur-landed-cost-purchase-order';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';

@Component({
  selector: 'app-landed-cost-purchase-order',
  templateUrl: './landed-cost-purchase-order.component.html',
  styleUrls: ['./landed-cost-purchase-order.component.css']
})
export class LandedCostPurchaseOrderComponent implements OnInit {
  @Input() CostID: any;
  @Input() Status: any;
  @Input() WarehouseID: any;

  @Output() activeNextTab = new EventEmitter();
  @Output() cancleButtonClick = new EventEmitter();

  Mode: any = 'List';
  ColumnDefs;
  RowData: any;
  LandedCostOrderForm: FormGroup;
  AgLoad: boolean = false
  landedOrder: any;
  submitted: boolean;
  templates: any;
  purchaseOrder: any;
  CompanyID = localStorage.getItem('CompanyID');
  modalRef: BsModalRef;
  IsActive: boolean;
  Currentpage: string;
  PageSize: any;
  displayPurchaseOrderList: boolean;

  constructor(
    private FB: FormBuilder,
    private toastr: ToastrService,
    private landedCostService: LandedCostService,
    private purchaseOrderService: PurchaseOrderService,
    public modalService: BsModalService,
  ) { }

  ngOnInit() {
    console.log("Status is :");
    console.log(this.Status);
    this.CreateForm();
    this.BindPurchaseOrder();
  }

  CreateForm() {
    this.LandedCostOrderForm = this.FB.group({
      PurchaseOrder: this.FB.array([])
    });
  }

  get PurchaseOrder(): FormArray {
    return this.LandedCostOrderForm.get('PurchaseOrder') as FormArray;
  }
  setPurchaseOrder(purchaseOrder: any[]): FormArray {
    const purchaseOrderArray = new FormArray([]);
    purchaseOrder.forEach(a => {
      purchaseOrderArray.push(this.FB.group({
        PurchaseOrderNumber: a.purchaseOrderNumber,
        VendorID: a.vendorID,
        CurrencyID: a.currencyID,
        Vendor: a.vendorAccountName,
        Currency: a.foreignCurrency,
        OrderedDate: a.orderedDate,
        isPOSelected: a.isPOSelected,
        CompanyID: a.companyID,
        PurchaseLandedCostID: a.purchaseLandedCostID,
        PurchaseOrderID: a.purchaseOrderID
      }));
    })
    return purchaseOrderArray
  }

  get f() { return this.LandedCostOrderForm.controls; }

  BindPurchaseOrder() {
    debugger;
    this.landedCostService.getPurchaseOrder(this.CostID, this.WarehouseID).subscribe((resp: any) => {
      this.purchaseOrder = resp.data.purchaseOrder;
      console.log(resp);
      if (this.purchaseOrder.length !== 0) {
        this.LandedCostOrderForm.setControl('PurchaseOrder', this.setPurchaseOrder(this.purchaseOrder));
        this.displayPurchaseOrderList = true;
      }
      else {
        this.displayPurchaseOrderList = false;
        this.toastr.warning("No Purchase Order found");
      }

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });

  }
  checkAll(selected) {
    if (selected.target.checked) {
      this.PurchaseOrder.controls.forEach(a => {
        a.patchValue({ SelectPurchaseOrder: true });
      });
    }
    else {
      this.PurchaseOrder.controls.forEach(a => {
        a.patchValue({ SelectPurchaseOrder: false });
      });
    }
  }
  DeletePurchaseOrder(i, purchaseID) {
    if (confirm("Deleteing this PO will delete all Import Cost and Taxable import data.Are you sure you want to delete ?")) {
      this.PurchaseOrder.controls[i].patchValue({ isPOSelected: false });
      this.landedCostService.deletePurchaseOrder(purchaseID, this.CostID).subscribe((res: any) => {
        console.log(res);

      })
    }

  }
  Cancel() {
    this.cancleButtonClick.emit();
  }

  onSave() {
    this.submitted = true;
    if (this.LandedCostOrderForm.invalid) {
      return;
    }
    let submitPurchaseOrderList: LbsPurLandedCostPurchaseOrder[] = [];
    this.PurchaseOrder.controls.forEach(a => {
      if (a.get('isPOSelected').value) {
        let submitPurchaseOrder: any = new LbsPurLandedCostPurchaseOrder();
        submitPurchaseOrder.PurchaseLandedCostID = this.CostID;
        submitPurchaseOrder.CompanyID = this.CompanyID;
        submitPurchaseOrder.PurchaseOrderID = a.get('PurchaseOrderID').value;
        submitPurchaseOrder.ForeignCurrency = a.get('Currency').value;
        submitPurchaseOrder.VendorID = a.get('VendorID').value;
        submitPurchaseOrder.CurrencyID = a.get('CurrencyID').value
        submitPurchaseOrder.CraetedBy = localStorage.getItem('LoginID');
        submitPurchaseOrder.isPOSelected = a.get('isPOSelected').value;
        submitPurchaseOrderList.push(submitPurchaseOrder);
      }
    });
    console.log(submitPurchaseOrderList);
    this.landedCostService.submitLandedCostPurchaseOrder(submitPurchaseOrderList).subscribe((response) => {
      console.log(response);
      if (response) {
        this.toastr.success("Purchase Order has been submitted successfully");
        this.activeNextTab.emit();
      }
    })
  }

  //@ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}

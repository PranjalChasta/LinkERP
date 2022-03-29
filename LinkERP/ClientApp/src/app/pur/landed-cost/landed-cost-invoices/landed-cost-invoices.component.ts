import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LandedCostInvoicesService } from '../../services/landed-cost-invoices.service';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { CustomValidators } from 'ngx-custom-validators';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { LbsPurLandedCost } from 'src/app/models/pur/lbs-pur-landed-cost';
import { LandedCostInvoices } from 'src/app/models/pur/landed-cost-invoices';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { date } from 'ngx-custom-validators/src/app/date/validator';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';

@Component({
  selector: 'app-landed-cost-invoices',
  templateUrl: './landed-cost-invoices.component.html',
  styleUrls: ['./landed-cost-invoices.component.css']
})
export class LandedCostInvoicesComponent implements OnInit {
  @Input() CostID: any;
  @Input() Status: any;
  @Output() activeShippinglinesTab = new EventEmitter();
  @Output() cancleButtonClick = new EventEmitter();

  LandedCostInvoiceForm: FormGroup;
  CompanyID = localStorage.getItem('CompanyID');
  submitted: boolean;
  invoiceDetailList: any;
  displayInvoiceList: boolean;
  InvoiceStart: any;
  InvoiceError: boolean;
  ImportAndTaxableImportSubmitted: boolean;

  constructor(
    private FB: FormBuilder,
    private toastr: ToastrService,
    private landedCostInvoiceService: LandedCostInvoicesService
  ) { }

  ngOnInit() {

    this.CreateForm();
    this.BindLandedCostInvoice();

  }

  CreateForm() {
    this.LandedCostInvoiceForm = this.FB.group({
      Invoice: this.FB.array([])
    });
  }
  setInvoice(invoiced: any[]): FormArray {
    const invoicedArray = new FormArray([]);
    invoiced.forEach(a => {
      invoicedArray.push(this.FB.group({
        Id: a.id,
        InvoiceNo: a.invoiceNo,
        Vendor: a.vendorAccountName,
        VendorID: a.vendorID,
        // PurchaseOrderID:a.purchaseOrderID,
        Currency: a.currencyName,
        FxRate: a.fxRate,
        ExpectedHomeAmount: a.expectedHomeAmount,
        ExpectedFXAmount: a.expectedFXAmount,
        BookedInHomeAmount: a.bookedInHomeAmount,
        BookedInFXAmount: a.bookedInFXAmount,
        TaxAmount: a.taxAmount,
        HomeAmountIncTax: a.homeAmountIncTax,
        Invoiced: a.invoiced,
        InvoiceDate: a.invoiceDate ? a.invoiceDate : new Date(),
        DueDate: a.dueDate ? a.dueDate : new Date(),
        // Reference: a.reference,
        // Remark: a.remark,
        SelectInvoice: a.isInvoiceSelected
      }));
      if (a.isTaxableImportSubmitted == '1' && a.isImportCostSubmitted == '1') {
        this.ImportAndTaxableImportSubmitted = true;
      }
    })

    return invoicedArray
  }

  get f() { return this.LandedCostInvoiceForm.controls; }

  get LandedCoseInvoice(): FormArray {
    return this.LandedCostInvoiceForm.get('Invoice') as FormArray;
  }
  checkAll(selected) {
    if (selected.target.checked) {
      this.LandedCoseInvoice.controls.forEach(a => {
        a.patchValue({ SelectInvoice: true });
      });
    }
    else {
      this.LandedCoseInvoice.controls.forEach(a => {
        a.patchValue({ SelectInvoice: false });
      });
    }
  }
  BindLandedCostInvoice() {
    this.landedCostInvoiceService.getLandedCostInvoicesByCostID(this.CostID).subscribe((resp: any) => {
      this.invoiceDetailList = resp.data.landedCostInvoice;
      console.log(resp);
      if (this.invoiceDetailList.length !== 0) {
        this.LandedCostInvoiceForm.setControl('Invoice', this.setInvoice(this.invoiceDetailList));
        this.displayInvoiceList = true;
      }
      else
        this.displayInvoiceList = false;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });

  }
  DeleteInvoice(i, data) {

  }
  Cancel() {
    this.cancleButtonClick.emit();
  }
  //To save the landed details to database table by calling the API service
  onSave() {
    this.submitted = true;
    if (this.LandedCostInvoiceForm.invalid) {
      return;
    }
    debugger
    let submitInvoicesList: LandedCostInvoices[] = [];
    this.LandedCoseInvoice.controls.forEach(a => {
      debugger
      if (a.get('SelectInvoice').value) {
        if (a.get('InvoiceNo').value == null) {
          this.toastr.warning("Please select Invoice Number");
          this.InvoiceError = true;
          return;
        }
        let landedcostInvoice: any = new LandedCostInvoices();
        landedcostInvoice.PurchaseLandedCostID = this.CostID;
        landedcostInvoice.CompanyID = this.CompanyID;
        landedcostInvoice.ID = a.get('Id').value;
        landedcostInvoice.VendorID = a.get('VendorID').value;
        landedcostInvoice.InvoiceNo = a.get('InvoiceNo').value;
        landedcostInvoice.InvoiceDate = a.get('InvoiceDate').value;
        landedcostInvoice.DueDate = a.get('DueDate').value;
        landedcostInvoice.FXRate = a.get('FxRate').value;
        submitInvoicesList.push(landedcostInvoice);
      }
    });
    console.log(submitInvoicesList);
    if (submitInvoicesList.length != 0 && !this.InvoiceError) {
      this.landedCostInvoiceService.submitLandedCostInvoices(submitInvoicesList).subscribe((response) => {
        console.log(response);
        if (response) {
          this.toastr.success("Invoices has been submitted successfully");
          this.activeShippinglinesTab.emit('InvoiceDone');
          if (this.ImportAndTaxableImportSubmitted) {
            this.activeShippinglinesTab.emit('AllDone');
          }
        }
      })
    } else if (!this.InvoiceError) {
      this.toastr.warning("Please select invoices Checkbox");
    }

  }

}

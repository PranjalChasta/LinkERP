import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LandedCostTaxableImportsService } from '../../services/landed-cost-taxable-imports.service';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ngx-custom-validators';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { DeleteRecordsService } from 'src/app/shared/services/deleterecords.service';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { LandedCostTaxableImports } from 'src/app/models/pur/landed-cost-taxable-imports';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { LandedCostImportCostService } from '../../services/landed-cost-import-cost.service';

@Component({
  selector: 'app-landed-cost-taxable-imports',
  templateUrl: './landed-cost-taxable-imports.component.html',
  styleUrls: ['./landed-cost-taxable-imports.component.css']
})
export class LandedCostTaxableImportsComponent implements OnInit {
  @Input() CostID: any;
  @Input() Status: any;
  @Output() activeShippinglinesTab = new EventEmitter();
  @Output() cancleButtonClick = new EventEmitter();
  TaxableImportsForm: FormGroup;
  ColumnDefs;
  RowData: any;
  CompanyID = localStorage.getItem('CompanyID');
  ledger: any;
  vendors: any;

  landedCostImport: any;
  submitted: boolean;
  taxcodes: any;
  IsActive: boolean;
  PageSize: any;
  Currentpage: string;
  duedate: Date;
  InvoiceAndImportSubmitted: boolean;

  constructor(
    private FB: FormBuilder,
    private toastr: ToastrService,
    private commonService: InvCommonService,
    private landedImportsService: LandedCostTaxableImportsService,
    private cryptoAes: CryptoAes,
    private deleteRecordsService: DeleteRecordsService,
    private syscommonService: SysCommonService,
    private landedCostImportCostService: LandedCostImportCostService,
    public modalService: BsModalService
  ) { }

  ngOnInit() {
    this.duedate = new Date();
    this.duedate.setDate(this.duedate.getDate() + 30);
    this.CreateForm();
    this.BindVendor();
    this.BindLedger();
    this.BindTaxCode();
    setTimeout(() => {
      this.BindLandedCostImports();
    }, 1000);

  }

  CreateForm() {
    this.TaxableImportsForm = this.FB.group({
      TaxableImports: this.FB.array([this.CreateTaxableImports()]),
    });
  }
  //get TaxableImports() { return this.TaxableImportsForm.get('Imports') as FormGroup; }
  get TaxableImportArray() {
    return this.TaxableImportsForm.get('TaxableImports') as FormArray;
  }
  get f() { return this.TaxableImportsForm.controls; }

  CreateTaxableImports(): FormGroup {
    return this.FB.group({
      TaxableImportID: [''],
      Creditor: ['-1'],
      Description: [''],
      Amount: [0],
      TaxRateDescription: ['-1'],
      TaxAmount: [0],
      TaxRate: [''],
      VendorLedger: ['-1'],
      TaxLedger: ['-1'],
      TaxID: [''],
      Invoiced: [false],
      InvoiceDate: [new Date()],
      DueDate: [this.duedate],
      InvoiceNo: ['']
    });
  }

  setLandedCostTaxalbeImports(LandedCostTaxableImports: any[]): FormArray {
    const formArray = new FormArray([]);
    LandedCostTaxableImports.forEach(ba => {
      let taxRate = this.taxcodes.filter(x => x.id == ba.taxID)
      formArray.push(this.FB.group({
        TaxableImportID: ba.id,
        Creditor: ba.vendorID,
        Description: ba.importCostDescription,
        Amount: ba.amount,
        TaxRateDescription: ba.taxID,
        TaxAmount: ba.taxAmount,

        TaxRate: taxRate[0].taxRate,
        VendorLedger: ba.vendorLedgerID,
        TaxLedger: ba.taxLedgerID,
        Invoiced: ba.invoiced,
        InvoiceDate: ba.invoiceDate,
        DueDate: ba.dueDate,
        InvoiceNo: ba.invoiceNo
      }));
      if (ba.isInvoiceSubmitted == '1' && ba.isImportCostSubmitted == '1') {
        this.InvoiceAndImportSubmitted = true;
      }
    });
    return formArray;
  }


  BindLandedCostImports() {
    this.landedImportsService.getLandedCostTaxableImportsByCostID(this.CostID).subscribe((resp: any) => {
      this.landedCostImport = resp.data.taxableImportDetails;
      console.log(this.landedCostImport);
      if (this.landedCostImport.length !== 0) {
        this.TaxableImportsForm.setControl('TaxableImports', this.setLandedCostTaxalbeImports(this.landedCostImport));
      }

    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  Cancel() {
    this.cancleButtonClick.emit();
  }


  AddNewTaxableImport() {
    this.TaxableImportArray.push(this.CreateTaxableImports());
  }
  Remove(i, id) {
    this.TaxableImportArray.removeAt(i);
    let ID = id.value.TaxableImportID;
    if (ID != "") {
      this.deleteTaxableImportRow(id.value.TaxableImportID);
    }
  }
  //Delete Taxable Import Row
  deleteTaxableImportRow(ID) {
    this.landedImportsService.deleteLandedCostTaxableImportsByID(ID, 'LBS_PUR_LandedCostTaxableImports', localStorage.getItem('LoginID')).subscribe((response) => {
      console.log(response);
      if (response) {
        //this.toastr.success("Taxable import cost has been submitted successfully");
      }
    })
  }
  BindLedger() {
    this.landedImportsService.getLedger().subscribe((resp: any) => {
      this.ledger = resp.data.ledgers;
      console.log(this.ledger);

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  //To bind the data of all vendor to the Grid.
  BindVendor() {
    this.commonService.getVendor().subscribe((resp: any) => {
      this.vendors = resp.data.vendors;
    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  BindTaxCode() {
    this.landedCostImportCostService.getTaxCode().subscribe((resp: any) => {
      this.taxcodes = resp.data.taxDetails;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  onTaxDescriptionChange($event, i) {
    let taxID = $event.target.value;
    let result = this.taxcodes.filter(x => x.id == taxID)
    if (result) {
      this.TaxableImportArray.controls[i].patchValue({ TaxRate: result[0].taxRate });
      let TaxAmount = this.TaxableImportArray.controls[i].get('TaxAmount').value;
      let taxAmtvalue;
      if (result[0].taxRate == 0) {
        taxAmtvalue = 0;
      } else {
        taxAmtvalue = (result[0].taxRate / 100);
      }
      this.TaxableImportArray.controls[i].patchValue({ Amount: TaxAmount * (taxAmtvalue) });
    }
  }
  onAmountChange(amount, i) {
    let taxrate = this.TaxableImportArray.controls[i].get('TaxRate').value;
    this.TaxableImportArray.controls[i].patchValue({ Amount: amount * (taxrate / 100) });
  }

  onSave() {
    this.submitted = true;
    if (this.TaxableImportsForm.invalid) {
      return;
    }
    //this.AddNewTaxableImport();
    let submitTaxableImportsList: LandedCostTaxableImports[] = [];
    this.TaxableImportArray.controls.forEach(a => {
      if (a.get('Creditor').value) {
        let submitTaxableImports: any = new LandedCostTaxableImports();
        submitTaxableImports.ID = a.get('TaxableImportID').value;
        submitTaxableImports.PurchaseLandedCostID = this.CostID;
        submitTaxableImports.CompanyID = this.CompanyID;
        submitTaxableImports.ImportCostDescription = a.get('Description').value;
        submitTaxableImports.TaxID = a.get('TaxRateDescription').value;
        submitTaxableImports.VendorID = a.get('Creditor').value;
        submitTaxableImports.InvoiceNo = a.get('InvoiceNo').value;
        submitTaxableImports.VendorLedgerID = a.get('VendorLedger').value;
        submitTaxableImports.TaxLedgerID = a.get('TaxLedger').value;
        submitTaxableImports.Amount = a.get('Amount').value;
        submitTaxableImports.TaxAmount = a.get('TaxAmount').value;
        submitTaxableImports.DueDate = a.get('DueDate').value;
        submitTaxableImports.InvoiceDate = a.get('InvoiceDate').value;
        submitTaxableImportsList.push(submitTaxableImports);
      }
    });
    console.log(submitTaxableImportsList);
    this.landedImportsService.submitLandedCostTaxableImports(submitTaxableImportsList).subscribe((response) => {
      console.log(response);
      if (response) {
        this.toastr.success("Taxable import cost has been submitted successfully");
        this.activeShippinglinesTab.emit('TaxableImportDone');
        if (this.InvoiceAndImportSubmitted) {
          this.activeShippinglinesTab.emit('AllDone');
        }
      }
    })

  }

  //@ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
}

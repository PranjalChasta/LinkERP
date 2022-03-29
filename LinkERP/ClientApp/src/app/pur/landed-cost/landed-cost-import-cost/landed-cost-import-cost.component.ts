import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LandedCostImportCostService } from '../../services/landed-cost-import-cost.service';
import { LandedCostImportCost } from 'src/app/models/pur/lbs_pur_landed-cost-import-cost';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { CustomValidators } from 'ngx-custom-validators';

@Component({
  selector: 'app-landed-cost-import-cost',
  templateUrl: './landed-cost-import-cost.component.html',
  styleUrls: ['./landed-cost-import-cost.component.css']
})
export class LandedCostImportCostComponent implements OnInit {
  @Input() CostID: any;
  @Input() Status: any;
  @Output() activeShippinglinesTab = new EventEmitter();
  @Output() cancleButtonClick = new EventEmitter();

  LandedCostImportCostForm: FormGroup;
  ImportCostData: any;
  submitted: boolean;
  CompanyID = localStorage.getItem('CompanyID');
  vendors: any;
  taxcodes: any;
  ledger: any;
  duedate: Date;
  ApportionMethod: any = ['Cost', 'Weight', 'Cubic']
  noApportioned: boolean;
  ApportionedChecked: boolean = true;
  InvoiceAndTaxableImportSubmitted: boolean;
  constructor(
    private FB: FormBuilder,
    private toastr: ToastrService,
    private commonService: InvCommonService,
    private syscommonService: SysCommonService,
    private landedImportCostService: LandedCostImportCostService
  ) { }
  get ImportCostArray(): FormArray {
    return this.LandedCostImportCostForm.get('ImportCost') as FormArray;
  }
  ngOnInit() {
    this.duedate = new Date();
    this.duedate.setDate(this.duedate.getDate() + 30);
    this.CreateForm();
    this.BindVendor();
    this.BindLedger();
    this.BindTaxCode();
    setTimeout(() => {
      this.BindImportCost();
    }, 1000);
  }
  CreateForm() {
    this.LandedCostImportCostForm = this.FB.group({
      ImportCost: this.FB.array([this.CreateImportCost()])
    });
  }
  //get ImportCost() { return this.LandedCostImportCostForm.get('Cost') as FormGroup; }

  BindLedger() {
    this.landedImportCostService.getLedger().subscribe((resp: any) => {
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
      console.log(this.vendors);

    }, (error) => {
      this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  BindTaxCode() {
    // this.syscommonService.getTaxCode().subscribe((resp: any) => {
    //   this.taxcodes = resp.data.taxcode;
    // }, (error) => {
    //   console.error('Problem with the sevice. Please try later : ' + error);
    // });
    this.landedImportCostService.getTaxCode().subscribe((resp: any) => {
      this.taxcodes = resp.data.taxDetails;
      console.log(this.taxcodes);

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  setImportCost(ImportCost: any[]): FormArray {
    const formArray = new FormArray([]);
    ImportCost.forEach(ba => {
      //let taxRate =this.taxcodes.filter(x=>x.id ==ba.taxID)
      formArray.push(this.FB.group({
        ImportCostID: ba.id,
        Creditor: ba.vendorID,
        CostType: ba.costDescription,
        FxRate: ba.fxRate,
        VendorLedger: ba.vendorLedgerID,
        CostLedger: ba.costLedgerID,
        TaxRateDescription: ba.taxID,
        TaxAmount: ba.taxAmount,
        LineTotalForeignExchangeCostTaxInclusive: ba.lineTotalForeignExchangeCostTaxInclusive,
        LineTotalForeignExchangeCostTaxExclusive: ba.lineTotalForeignExchangeCostTaxExclusive,
        LineTotalHomeAmountTaxInclusive: ba.lineTotalHomeAmountTaxInclusive,
        LineTotalTaxAmount: ba.lineTotalTaxAmount,
        TaxRate: ba.taxRate,
        TotalExcludingTaxHome: ba.totalExcludingTaxHome,
        TotalLineTaxAmountHome: ba.totalLineTaxAmountHome,
        Apportion: ba.apportion,
        ApportionMethod: ba.apportionMethod,
        Invoiced: ba.invoiced,
        InvoiceDate: ba.invoiceDate,
        DueDate: ba.dueDate,
        InvoiceNo: ba.invoiceNo
      }));
      if (ba.isInvoiceSubmitted == '1' && ba.isImportCostSubmitted == '1') {
        this.InvoiceAndTaxableImportSubmitted = true;
      }
    });

    return formArray;

  }
  CreateImportCost(): FormGroup {
    return this.FB.group({
      ImportCostID: [''],
      Creditor: ['-1', CustomValidators.notEqual('-1')],
      VendorLedger: ['-1', CustomValidators.notEqual('-1')],
      CostLedger: ['-1', CustomValidators.notEqual('-1')],
      CostType: ['', Validators.required],
      FxRate: [''],
      TaxRateDescription: ['-1', CustomValidators.notEqual('-1')],
      TaxID: [''],
      TaxRate: [0],
      LineTotalForeignExchangeCostTaxExclusive: [0],
      LineTotalTaxAmount: [0],
      LineTotalForeignExchangeCostTaxInclusive: [0],
      TotalExcludingTaxHome: [0],
      TotalLineTaxAmountHome: [0],
      LineTotalHomeAmountTaxInclusive: [0],
      ApportionMethod: ['-1'],
      Apportion: [false],
      Invoiced: [false],
      InvoiceDate: [new Date()],
      DueDate: [this.duedate],
      InvoiceNo: ['', Validators.required]
    });
  }

  BindImportCost() {
    this.landedImportCostService.getLandedCostImportCostByCostID(this.CostID).subscribe((resp: any) => {
      this.ImportCostData = resp.data.importCost;
      console.log(this.ImportCostData);
      if (this.ImportCostData.length !== 0) {     
        this.LandedCostImportCostForm.setControl('ImportCost', this.setImportCost(this.ImportCostData));
        //this.disableInputs()
      }
    }, (error) => {
      //console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  // disableInputs() {
  //   debugger;
  //   (<FormArray>this.LandedCostImportCostForm.get('Apportion'))
  //     .controls
  //     .forEach(control => {
  //       control.disable();
  //     })
  // }
  AddNewImportCost() {
    this.ImportCostArray.push(this.CreateImportCost());
  }

  Remove(i, id) {
    this.ImportCostArray.removeAt(i);
    let ID = id.value.ImportCostID;
    if (ID != "") {
      this.deleteImportCostRow(ID);
    }
  }
  //Delete Taxable Import Row
  deleteImportCostRow(ID) {
    this.landedImportCostService.deleteLandedImportCostByID(ID, 'LBS_PUR_LandedCostImportCosts', localStorage.getItem('LoginID')).subscribe((response) => {
      console.log(response);
      if (response) {
        this.toastr.success("Import cost has been deleted successfully");
      }
    })
  }
  onApportionedChanged(i, $event) {
    if ($event.target.value == '-1') {
      this.ImportCostArray.controls[i].enable();
      this.ImportCostArray.controls[i].patchValue({ Apportion: false });
      this.ImportCostArray.controls[i].get('Invoiced').disable();
    } else {
      this.ImportCostArray.controls[i].disable();
      this.ImportCostArray.controls[i].patchValue({ Apportion: true });
      this.ImportCostArray.controls[i].get('ApportionMethod').enable();
    }
  }
  onApportionedSelected(i, $event) {
    if ($event.target.checked) {
      this.ImportCostArray.controls[i].disable();
      this.ImportCostArray.controls[i].patchValue({ ApportionMethod: 'Cost' });
      this.ImportCostArray.controls[i].patchValue({ Apportion: true });
      this.ImportCostArray.controls[i].get('Apportion').enable();
      this.ImportCostArray.controls[i].get('ApportionMethod').enable();
    } else {
      this.ImportCostArray.controls[i].enable();
      this.ImportCostArray.controls[i].patchValue({ ApportionMethod: '-1' });
      this.ImportCostArray.controls[i].get('Invoiced').disable();
      //this.ImportCostArray.controls[i].get('Apportioned').enable();
    }
  }
  onTaxDescriptionChange($event, i) {
    let taxID = $event.target.value;
    let result = this.taxcodes.filter(x => x.id == taxID)
    if (result) {
      this.ImportCostArray.controls[i].patchValue({ TaxRate: result[0].taxRate });
    }
  }

  onForeignExTaxAmountChange(amount, i) {
    //amount=LineTotalHomeAmountTaxExclusive;
    //LineTotalHomeAmountTaxExclusive* TaxRate =LineTotalTaxAmount
    //LineTotalTaxAmount+LineTotalHomeAmountTaxExclusive=LineTotalForeignExchangeCostTaxInclusive
    //LineTotalHomeAmountTaxExclusive*FxRate=TotalExcludingTaxHome
    //TotalExcludingTaxHome*TaxRate=TotalLineTaxAmountHome
    //TotalExcludingTaxHome+TotalLineTaxAmountHome=LineTotalHomeAmountTaxInclusive
    amount = Number(amount);
    let taxrate = this.ImportCostArray.controls[i].get('TaxRate').value;

    let lineToalAmt = (amount * (taxrate / 100));
    this.ImportCostArray.controls[i].patchValue({ LineTotalTaxAmount: lineToalAmt });

    let lineTotalTaxAmount = this.ImportCostArray.controls[i].get('LineTotalTaxAmount').value;
    let lineTotalForeignExchangeCostTaxInclusive = (amount + lineTotalTaxAmount);

    this.ImportCostArray.controls[i].patchValue({ LineTotalForeignExchangeCostTaxInclusive: lineTotalForeignExchangeCostTaxInclusive });

    let fxRate = this.ImportCostArray.controls[i].get('FxRate').value;
    let totalExcludingTaxHome = fxRate * amount;

    this.ImportCostArray.controls[i].patchValue({ TotalExcludingTaxHome: totalExcludingTaxHome });
    let totalLineTaxAmountHome = (totalExcludingTaxHome * (taxrate / 100));
    this.ImportCostArray.controls[i].patchValue({ TotalLineTaxAmountHome: totalLineTaxAmountHome });

    let lineTotalHomeAmountTaxInclusive = totalExcludingTaxHome + totalLineTaxAmountHome;

    this.ImportCostArray.controls[i].patchValue({ LineTotalHomeAmountTaxInclusive: lineTotalHomeAmountTaxInclusive });
  }

  Cancel() {
    this.cancleButtonClick.emit();
  }

  onSave() {
    this.submitted = true;
    if (this.LandedCostImportCostForm.invalid) {
      return;
    }
    this.ImportCostArray.controls.forEach(a => {
      if (a.get('Apportion').value == false) {
        this.toastr.warning("Must Apportioned the cost before submitting");
        this.ApportionedChecked = false;
      }
    })
    //this.AddNewTaxableImport();
    if (this.ApportionedChecked) {
      let submitLandedImportCostList: LandedCostImportCost[] = [];
      this.ImportCostArray.controls.forEach(a => {
        if (a.get('Apportion').value) {
          let submitImportCost: any = new LandedCostImportCost();
          submitImportCost.ID = a.get('ImportCostID').value;
          submitImportCost.PurchaseLandedCostID = this.CostID;
          submitImportCost.CompanyID = this.CompanyID;
          submitImportCost.CostDescription = a.get('CostType').value;
          submitImportCost.TaxID = a.get('TaxRateDescription').value;
          submitImportCost.VendorID = a.get('Creditor').value;
          submitImportCost.InvoiceNo = a.get('InvoiceNo').value;
          submitImportCost.VendorLedgerID = a.get('VendorLedger').value;
          submitImportCost.CostLedgerID = a.get('CostLedger').value;

          submitImportCost.CurrencyID = a.get('CostLedger').value;
          submitImportCost.FxRate = a.get('FxRate').value;

          submitImportCost.TaxRate = a.get('TaxRate').value;
          submitImportCost.LineTotalForeignExchangeCostTaxExclusive = a.get('LineTotalForeignExchangeCostTaxExclusive').value;
          submitImportCost.LineTotalForeignExchangeCostTaxInclusive = a.get('LineTotalForeignExchangeCostTaxInclusive').value;
          submitImportCost.LineTotalTaxAmount = a.get('LineTotalTaxAmount').value;
          submitImportCost.TotalExcludingTaxHome = a.get('TotalExcludingTaxHome').value;

          submitImportCost.TotalLineTaxAmountHome = a.get('TotalLineTaxAmountHome').value;
          submitImportCost.LineTotalHomeAmountTaxInclusive = a.get('LineTotalHomeAmountTaxInclusive').value;
          submitImportCost.LineTotalHomeAmountTaxInclusive = a.get('LineTotalHomeAmountTaxInclusive').value;


          submitImportCost.Apportion = a.get('Apportion').value;
          submitImportCost.ApportionMethod = a.get('ApportionMethod').value;

          submitImportCost.DueDate = a.get('DueDate').value;
          submitImportCost.InvoiceDate = a.get('InvoiceDate').value;
          submitLandedImportCostList.push(submitImportCost);
        }
      });
      console.log(submitLandedImportCostList);
      this.landedImportCostService.submitLandedImportCost(submitLandedImportCostList).subscribe((response) => {
        console.log(response);
        if (response) {
          this.toastr.success("Landed import cost has been submitted successfully");
          this.activeShippinglinesTab.emit('ImportCostDone');
          if(this.InvoiceAndTaxableImportSubmitted){
            this.activeShippinglinesTab.emit('AllDone');
          }
        }
      })
    }


  }
}

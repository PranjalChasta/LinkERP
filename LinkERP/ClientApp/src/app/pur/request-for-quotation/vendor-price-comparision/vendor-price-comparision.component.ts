import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { ToastrService } from 'ngx-toastr';
import { RequestForQuotationService } from '../../services/request-for-quotation.service';
import { CustomValidators } from 'ngx-custom-validators';
import { LbsQuoteAnalysis } from 'src/app/models/pur/lbs_pur_quoteAnalysis';

@Component({
  selector: 'app-vendor-price-comparision',
  templateUrl: './vendor-price-comparision.component.html',
  styleUrls: ['./vendor-price-comparision.component.css']
})
export class VendorPriceComparisionComponent implements OnInit {
  VendorPriceComparisionForm: FormGroup;
  @Input() RequisitionID;
  Vendor: any;
  RequisitionDetails: any;
  submitted: boolean;
  ProductList: any;
  VendorPriceComparisionList: any;
  NoData: boolean;
  PreferredVendor: any;
  displayProductList: boolean;

  constructor(
    private requestForQuotationService: RequestForQuotationService,
    private toastr: ToastrService,
    private FB: FormBuilder,
  ) { }

  ngOnInit() {
    this.CreateForm();
    this.BindProductList();
  }
  CreateForm() {
    this.VendorPriceComparisionForm = this.FB.group({
      ProductID: ['-1', CustomValidators.notEqual('-1')],
      VendorPriceComparision: this.FB.array([])
    });
  }
  resetForm() {
    this.VendorPriceComparisionForm = this.FB.group({
      ProductID: ['-1', CustomValidators.notEqual('-1')],
      VendorPriceComparision: this.FB.array([])
    });
  }
  setVendorPriceComparision(vendorPriceComparision: any[]): FormArray {
    const vendorPriceComparisionArray = new FormArray([]);
    vendorPriceComparision.forEach(a => {
      vendorPriceComparisionArray.push(this.FB.group({
        ID: a.id,
        Vendor: a.vendor,
        VendorName: a.vendorName,
        UOM: a.uom,
        UnitPrice: a.unitPrice,
        SelectPreferredVendor: a.preferredVendor,
      }));
    })
    return vendorPriceComparisionArray
  }
  get f() { return this.VendorPriceComparisionForm.controls; }

  BindProductList() {
    this.requestForQuotationService.getProductsByRequisitionID(this.RequisitionID).subscribe((resp: any) => {
      console.log(resp.data.productList);
      this.ProductList = resp.data.productList;
    }, (error) => {
      this.toastr.error(error);
    });
  }

  productChange($event) {
    if (this.VendorPriceComparisionForm.get('ProductID').value != "-1") {
      this.getVendorPriceComparisionList();
    }
  }

  getVendorPriceComparisionList() {
    this.submitted = true;
    if (this.VendorPriceComparisionForm.invalid) {
      return;
    }
    this.requestForQuotationService.getVendorComparisionPrice(this.VendorPriceComparisionForm.get('ProductID').value, this.RequisitionID).subscribe((response: any) => {
      console.log(response);

      this.PreferredVendor = response.data.preferredVendorList;
      this.displayProductList = true;
      if (this.PreferredVendor.length !== 0)
        this.VendorPriceComparisionForm.setControl('VendorPriceComparision', this.setVendorPriceComparision(this.PreferredVendor));
      else
        this.displayProductList = false;
    })
  }

  get VendorPriceComparision(): FormArray {
    return this.VendorPriceComparisionForm.get('VendorPriceComparision') as FormArray;
  }
  selectPreferredVendor(rowIndex: number) {
    for (let i = 0; i < this.VendorPriceComparision.length; i++) {
      if (rowIndex != i) {
        this.VendorPriceComparision.at(i).patchValue({ SelectPreferredVendor: false });
      }
      else {
        this.VendorPriceComparision.at(i).patchValue({ SelectPreferredVendor: true });
      }
    }
  }
  onSave() {
    let submitVendorPriceComparisionList: LbsQuoteAnalysis[] = [];
    this.VendorPriceComparision.controls.forEach(a => {
      if (a.get('SelectPreferredVendor').value) {
        let submitVendorPriceComparision: any = new LbsQuoteAnalysis();
        submitVendorPriceComparision.ID = a.get('ID').value;
        submitVendorPriceComparision.PreferredVendor = a.get('SelectPreferredVendor').value;
        submitVendorPriceComparision.unitPrice = a.get('UnitPrice').value;
        submitVendorPriceComparisionList.push(submitVendorPriceComparision);
      }
    });
    console.log(submitVendorPriceComparisionList);
    this.requestForQuotationService.UpdateQuoteAnalysisData(submitVendorPriceComparisionList).subscribe((response) => {
      console.log(response);
      if (response) {
        this.toastr.success("Request has been submitted successfully");
        //this.resetForm();
      }
    })
  }
}

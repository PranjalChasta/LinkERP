import { Component, OnInit, Input } from '@angular/core';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { RequestForQuotationService } from '../../services/request-for-quotation.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { LbsQuoteAnalysis } from 'src/app/models/pur/lbs_pur_quoteAnalysis';



@Component({
  selector: 'app-vendor-quote-price',
  templateUrl: './vendor-quote-price.component.html',
  styleUrls: ['./vendor-quote-price.component.css']
})
export class VendorQuotePriceComponent implements OnInit {
  Vendor: any;
  RequisitionDetails: any;
  VendorQuotePriceForm: FormGroup;
  submitted: boolean;
  @Input() RequisitionID;
  RequsitionNumber: string;
  VendorPrice: any;
  displayProductList: boolean;
  totalrecords: any;

  constructor(
    private requestForQuotationService: RequestForQuotationService,
    private toastr: ToastrService,
    private FB: FormBuilder,
  ) { }

  ngOnInit() {
    this.CreateForm();
    this.BindVendor();
  }
  CreateForm() {
    this.VendorQuotePriceForm = this.FB.group({
      VendorID: ['-1', CustomValidators.notEqual('-1')],
      VendorQuotePrice: this.FB.array([])
    });
  }
  get f() { return this.VendorQuotePriceForm.controls; }

  get VendorQuotePrice(): FormArray {
    return this.VendorQuotePriceForm.get('VendorQuotePrice') as FormArray;
  }
  setVendorQuotePrice(vendorQuotePrice: any[]): FormArray {
    const vendorPriceQuoteArray = new FormArray([]);
    vendorQuotePrice.forEach(a => {
      vendorPriceQuoteArray.push(this.FB.group({
        ID: a.id,
        Product: a.product,
        ProductDescription: a.productDescription,
        UOM: a.uom,
        UnitPrice: a.unitPrice
      }));
    })
    debugger
    return vendorPriceQuoteArray
  }
  BindVendor() {

    this.requestForQuotationService.getVendorListByRequisitionID(this.RequisitionID).subscribe((resp: any) => {
      console.log(resp);
      this.Vendor = resp.data.vendorList;
    })
    // this.requestForQuotationService.getVendorList().subscribe((res:any)=>{
    //   console.log(res);
    // })
  }
  onVendorChange($event) {
    if (this.VendorQuotePriceForm.get('VendorID').value != "-1") {
      this.getProdcutList();
    }
  }

  getProdcutList() {
    this.submitted = true;
    if (this.VendorQuotePriceForm.invalid) {
      return;
    }
    this.requestForQuotationService.getProductForVendorPrice(this.VendorQuotePriceForm.get('VendorID').value, this.RequisitionID).subscribe((response: any) => {
      console.log(response);
      this.displayProductList = true;
      this.totalrecords = response.data.vendorQuotePriceList;
      if (response.data.vendorQuotePriceList) {
        this.VendorQuotePriceForm.setControl('VendorQuotePrice', this.setVendorQuotePrice(response.data.vendorQuotePriceList));
      } else {
        this.displayProductList = false;
      }

    })
  }

  onSave() {
    if (this.VendorQuotePriceForm.invalid) {
      return;
    }
    let submitVendorPriceList: LbsQuoteAnalysis[] = [];
    this.VendorQuotePrice.controls.forEach(a => {
      if (a.get('UnitPrice').value) {
        let QuoteAnalysis = new LbsQuoteAnalysis;
        QuoteAnalysis.ID = a.get('ID').value;
        QuoteAnalysis.unitPrice = a.get('UnitPrice').value;
        submitVendorPriceList.push(QuoteAnalysis);
      }
    });
    console.log(submitVendorPriceList);
    this.requestForQuotationService.UpdateQuoteAnalysisData(submitVendorPriceList).subscribe((response) => {
      console.log(response);
      this.toastr.success("Vendor Price has been updated successfully");
    })
  }
}

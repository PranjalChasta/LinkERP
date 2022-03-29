import { Component, EventEmitter, Input, OnInit, Output, TestabilityRegistry } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SopOrderService } from 'src/app/POS/services/sop-order.service';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';

@Component({
  selector: 'app-change-discount',
  templateUrl: './change-discount.component.html',
  styleUrls: ['./change-discount.component.css']
})
export class ChangeDiscountComponent implements OnInit {
  @Input() SelectedproductID: any;
  @Input() SelectedDiscount: any;
  @Input() SelectedTotal: any;
  @Input() SelectedQuantity: any;
  @Input() LineBeforeDiscount: any;
  @Input() WarehouseID: any;
  @Output() Cancel = new EventEmitter();
  @Output() setUnitprice = new EventEmitter<any>();
  @Input() SelctedDebtorID: any;
  @Input() RevQty: number;
  ProductDetails: any;
  ProductCode: any;
  ProductName: any;
  TaxName: any;
  QtyInStock: number;
  Discount: any;
  RevDiscount: any;
  @Output() setDiscount =  new EventEmitter<{Discount:string, TotalAmount:number}>();
  mode: string;
  isAmountChecked: any = true;
  isPercentageChecked: any = false;
  MinimumProfitPercentage = 0;
  ProductUnitCost = 0;
  public selectedDiscountType: any = 'Amount';
  constructor(private FB: FormBuilder,
    private toastr: ToastrService,
    private sysCommonService: SysCommonService,
    private modalService: BsModalService,
    private sopOrderService: SopOrderService) { }

  ngOnInit() {
    this.BindInventoryDetail();
    this.GetProductDetails();
    this.GetUnitCost();
    this.isAmountChecked = true;
    this.selectedDiscountType = 'Amount';
  }
  BindInventoryDetail() {
    debugger;
    this.sopOrderService.getProductDetailByProductID(this.SelectedproductID).subscribe((resp: any) => {
      this.ProductDetails = resp.data.product;
      this.ProductCode = this.ProductDetails.productCode;
      this.ProductName = this.ProductDetails.productName;
      this.TaxName = this.ProductDetails.taxCodeName;
      this.QtyInStock = this.ProductDetails.availableQuantity;
     // this.Discount = this.SelectedDiscount;
      this.RevDiscount = this.SelectedTotal;
      console.log(resp.data)
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  Close() {
    this.Cancel.emit();
  }
  OnSave() {
    this.Close();
    this.setDiscount.emit({Discount:this.SelectedDiscount, TotalAmount:this.RevDiscount});
  }
  setValue(val) {
    debugger;
    this.selectedDiscountType = val;
    if (val == 'Percentage') {
      this.isPercentageChecked = true;
      this.isAmountChecked = false;
    }
    else if (val == 'Amount') {
      this.isAmountChecked = true;
      this.isPercentageChecked = false;
    }
    else {
      this.isAmountChecked = false;
      this.isPercentageChecked = false;
    }
  }
  setDiscountValue(discountVal) { 
     if (this.selectedDiscountType == 'Percentage') {
      this.calculatioPercentageDiscount();
     }
     else if (this.selectedDiscountType == 'Amount') {
      this.calculatioAmountDiscount();
     }
   
  }
  calculatioAmountDiscount() {
    let unitPrice: any = 0;
    let quantity: any = 1;
    let discountAmount: any = 0;
    let discount: any = 0;
    let discountedUnitPrice: any = 0;
    let MinumunDiscount: any = 0;
    let TotalAfterMinimun: any = 0;
    let TotalAmount: any;
    let NormalDiscount: any = 0;
    let MinimunDiscount: any = 0;
    let minimunPercentage: any = 0;
    let Minimim: any = 0;
    if (this.SelectedQuantity) {
      quantity = Number(this.SelectedQuantity).toFixed(2);
    }
    if (this.SelectedTotal) {
      unitPrice = Number(this.SelectedTotal).toFixed(2);
    }
    if (this.SelectedDiscount) {
      discountAmount = Number(this.SelectedDiscount).toFixed(2);
    }
    discount = ((Number(unitPrice) * Number(this.SelectedDiscount)) / 100);
    MinumunDiscount = Number(this.ProductUnitCost) * (Number(this.MinimumProfitPercentage) / 100);

    if (this.MinimumProfitPercentage != 0) {
      TotalAfterMinimun = Number(this.ProductUnitCost) + Number(MinumunDiscount);
      let LineUnitPrice: any = unitPrice;
      Minimim = Number(LineUnitPrice - TotalAfterMinimun);
      if (discountAmount > Minimim) {
        TotalAmount = Minimim;
        MinimunDiscount = Minimim;
        minimunPercentage = this.MinimumProfitPercentage;
        NormalDiscount = discountAmount;
        //txtnewlinetotal.Text = (unitPrice - Minimim).ToString("0.00");
      }
      else {
        TotalAmount = discountAmount;
        MinimunDiscount = Minimim;
        minimunPercentage = this.MinimumProfitPercentage;
        NormalDiscount = discountAmount;
        //txtnewlinetotal.Text = (unitPrice - discountAmount).ToString("0.00");
      }

    }
    else {
      discountedUnitPrice = unitPrice - discountAmount;

      TotalAmount = discountAmount;//discountAmount / unitPrice * 100;
      //txtnewlinetotal.Text = (unitPrice - discountAmount).ToString("0.00");
      //((unitPrice * discountPercent) / 100);
      MinimunDiscount = 0;
      minimunPercentage = this.MinimumProfitPercentage;
      NormalDiscount = discountAmount;
    }
    this.RevDiscount = (unitPrice - discountAmount)

  }

  GetProductDetails() {
    this.sopOrderService.getProductDetails(this.SelectedproductID).subscribe((response: any) => {
      console.log(response.data.minimumProfitPercentage);
      this.MinimumProfitPercentage = response.data.product.minimumProfitPercentage;
    })
  }

  GetUnitCost() {
    this.sopOrderService.getUnitCost(this.WarehouseID, this.SelectedproductID).subscribe((response: any) => {
      if (response.data.unitprice) {
        this.ProductUnitCost = response.data.unitprice;
      }
    })
  }

  calculatioPercentageDiscount() {
    let unitPrice: any = 0;
    let quantity: any = 1;
    let discountPercent: any = 0;
    let discount: any = 0;
    let MinumunDiscount: any = 0;
    let ProductUnitCost: any = 0;
    let discountedUnitPrice: any = 0;
    let TotalAmount: any;
    let NormalDiscount: any = 0;
    let MinimunDiscount: any = 0;
    let minimunPercentage: any = 0;

    let TotalAfterMinimun: any = 0;
    if (this.SelectedQuantity) {
      quantity = Number(this.SelectedQuantity).toFixed(2);
    }
    if (this.SelectedTotal) {
      unitPrice = Number(this.SelectedTotal).toFixed(2);
    }
    if (this.SelectedDiscount) {
      discountPercent = Number(this.SelectedDiscount).toFixed(2);
    }
    discount = ((Number(unitPrice) * Number(this.SelectedDiscount)) / 100);
    MinumunDiscount = Number(this.ProductUnitCost) * (Number(this.MinimumProfitPercentage) / 100);
    if (this.MinimumProfitPercentage != 0) {
      TotalAfterMinimun = Number(ProductUnitCost) + Number(MinumunDiscount);
      var LineUnitPrice = unitPrice - TotalAfterMinimun;
      var Minimim = Number(unitPrice) - Number(TotalAfterMinimun);
      if (discount > Minimim) {
        TotalAmount = Minimim;
        discountedUnitPrice = unitPrice - discount;
        MinimunDiscount = Minimim;
        minimunPercentage = this.MinimumProfitPercentage;
        NormalDiscount = discount;

      }
      else {
        discount = ((unitPrice * discountPercent) / 100);
        TotalAmount = discount;
        discountedUnitPrice = unitPrice - discount;
        MinimunDiscount = Minimim;
        minimunPercentage = this.MinimumProfitPercentage;
        NormalDiscount = discount;

      }
    }
    else {
      discount = ((unitPrice * discountPercent) / 100);
      TotalAmount = discount;
      discountedUnitPrice = unitPrice - discount;
      MinimunDiscount = 0;
      minimunPercentage = this.MinimumProfitPercentage;
      NormalDiscount = discount;

    }
    this.RevDiscount = (unitPrice - discount);
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SopOrderService } from 'src/app/POS/services/sop-order.service';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';

@Component({
  selector: 'app-change-unitprice',
  templateUrl: './change-unitprice.component.html',
  styleUrls: ['./change-unitprice.component.css']
})
export class ChangeUnitpriceComponent implements OnInit {
  @Input() SelectedproductID: any;
  @Input() SelectedUnitprice: any;
  @Output() Cancel = new EventEmitter();
  @Input() RevQty: number;
  ProductDetails: any;
  ProductCode: any;
  ProductName: any;
  TaxName: any;
  QtyInStock: number;
  Unitprice: number;
  RevUnitprice: number;
  @Output() setUnitprice = new EventEmitter<any>();
  mode: string;
  constructor(private FB: FormBuilder,
    private toastr: ToastrService,
    private sysCommonService: SysCommonService,
    private modalService: BsModalService,
    private sopOrderService: SopOrderService) { }

  ngOnInit() {
    this.BindInventoryDetail();
  }
  BindInventoryDetail() {
    debugger;
    this.sopOrderService.getProductDetailByProductID(this.SelectedproductID).subscribe((resp: any) => {
      this.ProductDetails = resp.data.product;
      this.ProductCode = this.ProductDetails.productCode;
      this.ProductName = this.ProductDetails.productName;
      this.TaxName = this.ProductDetails.taxCodeName;
      this.QtyInStock = this.ProductDetails.availableQuantity;
      this.Unitprice = this.SelectedUnitprice;
      this.RevUnitprice = this.SelectedUnitprice;
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
    this.setUnitprice.emit(this.RevUnitprice);
  }
}

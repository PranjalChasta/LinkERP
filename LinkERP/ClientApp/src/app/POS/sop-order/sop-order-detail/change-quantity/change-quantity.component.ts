import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SopOrderService } from 'src/app/POS/services/sop-order.service';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';

@Component({
  selector: 'app-change-quantity',
  templateUrl: './change-quantity.component.html',
  styleUrls: ['./change-quantity.component.css']
})
export class ChangeQuantityComponent implements OnInit {
  @Input() SelectedproductID: any;
  @Input() SelectedQuantity: any;
  @Output() Cancel = new EventEmitter();
  @Input() RevQty: number;
  ProductDetails: any;
  ProductCode: any;
  ProductName: any;
  TaxName: any;
  QtyInStock: number;
  Quantity: number;
  RevQuantity: number;
  Mode: any;
  @Output() setQuantity = new EventEmitter<any>();
  @Input() SelectedRow: any;
  @Input() selectedDebtorID: any;
  mode: any = '';
  @Input() SelectedRowValue: any;
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
      this.Quantity = this.SelectedQuantity;
      this.RevQuantity = this.SelectedQuantity;
      console.log(resp.data)
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  Close() {
    this.Cancel.emit();
  }
  OnSave() {
    debugger;
    this.setQuantity.emit(this.RevQuantity);
    this.Close();
  }
}



import { Component, OnInit, forwardRef, TemplateRef, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgSelectOption } from '@angular/forms'
import { noop } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { PurCommonService } from 'src/app/pur/services/pur-common.service';


@Component({
  selector: 'purchase-order-search',
  templateUrl: './purchase-order-search.component.html',
  styleUrls: ['./purchase-order-search.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PurchaseOrderSearchComponent),
    multi: true
  }]
})
export class PurchaseOrderSearchComponent implements OnInit, ControlValueAccessor {


  @Output()
  OnPurchaseOrderSelectedChanged = new EventEmitter();

  ProductOrder: any;

  private onChange: (_: any) => void = noop;
  private value: any;
  @Input() PurchaseOrderNumber: any ;
  SearchText: any = '';

  constructor(private modalService: BsModalService,
    private purCommonService: PurCommonService) { }
  writeValue(obj: any): void {
    this.value = obj;

    if (this.value == null || this.value == '') {
    }
    else {
      // this.GetProductByID(this.value);
    }
    this.onChange(this.value);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {

  }
  setDisabledState?(isDisabled: boolean): void {

  }

  modalRef: BsModalRef;
  @ViewChild('purchaseOrderSearchBox') purchaseOrderSearchBox: TemplateRef<any>;

  ngOnInit() {
  }



  OpenSearch() {
    this.modalRef = this.modalService.show(this.purchaseOrderSearchBox);
  }

  PurchaseOrders: any[] = [];
  SearchPurchaseOrder() {
    debugger;
    let searchObject = {
      'SearchText': this.SearchText
    }

    this.purCommonService.getPurchaseOrderBySearch(searchObject).subscribe((resp: any) => {
      this.PurchaseOrders = resp.data.purchaseOrders;
    }, (error: any) => {

    });
  }

  SelectedPurchaseOrderID: any;
  SelectPurchaseOrder(ID, PONumber) {
    this.SelectedPurchaseOrderID = ID;
    this.PurchaseOrderNumber = PONumber;
    this.value = ID;
    this.onChange(this.value);
    this.onPurchaseOrderChanged(this.value);
    this.modalRef.hide();
  }

  onPurchaseOrderChanged(value: any) {
    this.OnPurchaseOrderSelectedChanged.emit(value);
  }

  Cancel() {
    this.modalRef.hide();
  }
}

import { Component, OnInit, forwardRef, TemplateRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgSelectOption } from '@angular/forms'
import { noop } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { SysCommonService } from 'src/app/sys/services/sys-common.service'

@Component({
  selector: 'product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ProductSearchComponent),
    multi: true
  }]
})
export class ProductSearchComponent implements OnInit, ControlValueAccessor {

  private onChange: (_: any) => void = noop;
  private value: any;
  @Input() WarehouseID: any;
  @Input() ModuleName: any;
  ProductDetails: any = '';
  SearchText: any = '';
  @Output() change = new EventEmitter<any>(); 
  @Output() changedetails = new EventEmitter<any>(); 
  @Input() VendorId: any;
  @Input() Action: any;
  Status: any;
 
  constructor(private modalService: BsModalService,
    private sysCommonService: SysCommonService) { }


  writeValue(obj: any): void {
   
    this.value = obj;
  
    if (this.value == null || this.value == '') {
    }
    else {
      this.GetProductByID(this.value);
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

  ngOnInit() {
    //alert(this.VendorId);
    //alert(this.Action);
    //alert(this.ModuleName);
  }
  modalRef: BsModalRef;
  @ViewChild('productSearchBox') productSearchBox: TemplateRef<any>;

  OpenSearch() {
    this.modalRef = this.modalService.show(this.productSearchBox);
  }
  Products: any[] = [];
  SearchProduct() {
    let searchParam: any = {
      'SearchText': this.SearchText,
      'ModuleName': this.ModuleName,
      'WarehouseID': this.WarehouseID,
      'SearchID1': this.VendorId,
      'Action': this.Action
    }

    this.sysCommonService.searchProduct(searchParam).subscribe((resp: any) => {
      this.Products = resp.data.productDetails;
      //this.Products = [];
    }, (error: any) => {

    });
  }
  ProductDetail: any;
  GetProductByID(ID) {
    if (ID != "-1" && ID != null && ID != "00000000-0000-0000-0000-000000000000") {
      this.sysCommonService.getProductByID(ID, this.ModuleName, this.WarehouseID).subscribe((resp: any) => {
        let product = resp.data.productDetail;
        this.ProductDetails = product.productCode + ' - ' + product.productName;
        this.Status = product.productStatus;
      }, (error: any) => {
      });
    }

  }

  SelectedProductID: any;
  SelectProduct(ID, Code, Name,productStatus,productStyleMatrixEnabled,serialisedProduct,customKit) {
    this.SelectedProductID = ID;
    this.ProductDetails = Code + ' - ' + Name;
    this.value = ID;
    this.onChange(this.value);
    this.change.emit(ID);
    const params = {
      ID: ID,
      Productcode: Code,
      Productname: Name,
      ProductStatus:productStatus,
      ProductStyleMatrixEnabled:productStyleMatrixEnabled,
      SerialisedProduct:serialisedProduct,
      CustomKit:customKit
      
      
    };
    this.changedetails.emit(params)
    this.modalRef.hide();
  }
  Cancel() {
    this.modalRef.hide();
  }
}

// import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
// import { BsModalService, BsModalRef } from 'ngx-bootstrap';
// import { noop } from 'rxjs';
// import { SysCommonService } from 'src/app/sys/services/sys-common.service';

// @Component({
//   selector: 'app-common-product-search',
//   templateUrl: './common-product-search.component.html',
//   styleUrls: ['./common-product-search.component.css']
// })
// export class CommonProductSearchComponent implements OnInit {

//   private onChange: (_: any) => void = noop;
//   private value: any;
//   @Input() WarehouseID:any;
//   ProductDetails: any = '';
//   SearchText: any = '';

//   constructor(private modalService: BsModalService,
//     private sysCommonService: SysCommonService) { }


//   writeValue(obj: any): void {
//     debugger;
//     console.log(this.WarehouseID);
//     this.value = obj;

//     if (this.value == null || this.value == '') {
//     }
//     else {
//       this.GetProductByID(this.value);
//     }
//     this.onChange(this.value);
//   }
//   registerOnChange(fn: any): void {
//     this.onChange = fn;
//   }
//   registerOnTouched(fn: any): void {

//   }
//   setDisabledState?(isDisabled: boolean): void {

//   }

//   ngOnInit() {

//   }
//   modalRef: BsModalRef;
//   @ViewChild('productSearchBox') productSearchBox: TemplateRef<any>;

//   OpenSearch() {
//     this.modalRef = this.modalService.show(this.productSearchBox);
//   }
//   Products: any[] = [];
//   SearchProduct() {
//     let searchParam: any = {
//       'SearchText': this.SearchText
//     }
//     this.sysCommonService.searchProduct(searchParam).subscribe((resp: any) => {
//       this.Products = resp.data.productDetails;
//     }, (error: any) => {

//     });
//   }
//   ProductDetail: any;
//   GetProductByID(ID) {

//     if(ID != "-1" && ID != null && ID != "00000000-0000-0000-0000-000000000000"){
//       this.sysCommonService.getProductByID(ID).subscribe((resp: any) => {
//         let product = resp.data.productDetail;
//         this.ProductDetails = product.productCode + ' - ' + product.productName;
//       }, (error: any) => {

//       });
//     }

//   }

//   SelectedProductID: any;
//   SelectProduct(ID, Code, Name) {
//     debugger;
//     this.SelectedProductID = ID;
//     this.ProductDetails = Code + ' - ' + Name;
//     this.value = ID;
//     this.onChange(this.value);
//     this.modalRef.hide();
//   }
//   Cancel() {
//     this.modalRef.hide();
//   }
// }

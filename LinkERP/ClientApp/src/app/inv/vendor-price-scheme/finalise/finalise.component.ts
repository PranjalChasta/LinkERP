import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { VendorPriceSchemeService } from '../../services/vendor-price-scheme.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-finalise',
  templateUrl: './finalise.component.html',
  styleUrls: ['./finalise.component.css']
})
export class FinaliseComponent implements OnInit {
  @Input() VendorPriceSchemeID;
  @Input() VendorID;
  @Input() IsParentActive:boolean;
  @Output() OnCancel = new EventEmitter();
  FinaliseList: any;
  ColumnDefs: { headerName: string; field: string; sortable: boolean; filter: boolean; }[];
  PageSize: string;
  Currentpage: string;
  RowData: any;
  AgLoad: boolean;
  constructor(
    private router: Router,
    private vendorPriceSchemeService: VendorPriceSchemeService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getPurchaseOrdersList();
    this.ColumnDefs = [
      { headerName: 'Purchase Order Number', field: 'purchaseOrderNumber', sortable: true, filter: true },
      { headerName: 'Ordered Quantity', field: 'orderedQuantity', sortable: true, filter: true },
      { headerName: ' Free Quantity', field: 'freeDealsQuantity', sortable: true, filter: true }
    ];
    this.PageSize = "50";
    this.Currentpage = "0";
  }
  getPurchaseOrdersList() {
    this.AgLoad = false;
    this.vendorPriceSchemeService.getPurchaseOrderRaisedAndreceived(this.VendorPriceSchemeID).subscribe((response: any) => {

      this.RowData = response.data.purchaseOrderRaisedAndReceivedList;

      this.AgLoad = true;
      console.log(this.RowData);
    })
  }
  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-pencil"></i></div>';
    return cellContent
  }
  CustomDeleteIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;" ><i class="re fa fa-trash-o"></i></div>';
    return cellContent
  }
  CraetePurchaseOrder() {
    let object = {
      "VendorPriceSchemeID": this.VendorPriceSchemeID,
      "CompanyID": localStorage.getItem('CompanyID')
    }
    this.vendorPriceSchemeService.createPurchaseOrder(object).subscribe((res: any) => {
      if (res) {
        this.toastr.success("Purchase Order created successfully");
      }
    })
    // this.router.navigate(['/pur/purchase-order']);
  }
}

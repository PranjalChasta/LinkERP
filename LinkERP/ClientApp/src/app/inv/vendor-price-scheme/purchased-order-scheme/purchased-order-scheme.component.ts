import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { VendorPriceSchemeService } from '../../services/vendor-price-scheme.service';

@Component({
  selector: 'app-purchased-order-scheme',
  templateUrl: './purchased-order-scheme.component.html',
  styleUrls: ['./purchased-order-scheme.component.css']
})
export class PurchasedOrderSchemeComponent implements OnInit {
  @Input() VendorId;
  @Input() VendorPriceSchemeID;
  AgLoad: boolean;
  ColumnDefs;
  PageSize: string;
  Currentpage: string;
  Loading: boolean;
  RowData: any;
  constructor(
    private toastr:ToastrService,
    private vendorPriceSchemeService: VendorPriceSchemeService
    ) { }

  ngOnInit() {
    
    this.AgLoad = false;
    this.ColumnDefs = [
      { headerName: 'Purchase Order', field: 'purchaseOrderNumber', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'GRN Number', field: 'grnNumber', sortable: true, filter: true },
      { headerName: 'Supplier Reference', field: 'supplierReference', sortable: true, filter: true },
      { headerName: 'Received Quantity', field: 'receivedQuantity', sortable: true, filter: true },
      { headerName: 'UnitCost', field: 'unitCost',  sortable: true, filter: true }
    ];
    this.PageSize = "50";
    this.Currentpage = "0";
    this.getPurchaseOrderScheme();
  }
  getPurchaseOrderScheme(){
    debugger;
    this.Loading = true;
    this.AgLoad = false;
    this.vendorPriceSchemeService.getPurchaseOrderList(this.VendorId,this.VendorPriceSchemeID).subscribe((response: any) => {
      this.RowData = response.data.purchaseOrderList;
      console.log(this.RowData);
      
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.toastr.error('Problem with the sevice. Please try later : ' + error);
      this.AgLoad = true;
    });
  }
}

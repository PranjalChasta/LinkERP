import { Component, OnInit ,Input} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PurchaseOrderService } from 'src/app/pur/services/purchase-order.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedFormatterService } from 'src/app/shared/services/shared-formatter.service';
@Component({
  selector: 'app-purchase-order-audit',
  templateUrl: './purchase-order-audit.component.html',
  styleUrls: ['./purchase-order-audit.component.css']
})
export class PurchaseOrderAuditComponent implements OnInit {
  @Input() PurchaseOrderID: any;
  CompanyID = localStorage.getItem('CompanyID');
  GoodsReceivedNoteCols: any;
  GoodsReceivedNotes: any[] = [];
  AgLoad: any = true;
  OrderauditForm: FormGroup;
  constructor( public toastr: ToastrService,
    private router: Router, private route: ActivatedRoute,
     private purchaseOrderService: PurchaseOrderService,
     private sharedFormatterService: SharedFormatterService) {
   
   }

  ngOnInit() {
    
    this.GetOrderaudit();
    console.log(this.PurchaseOrderID);
    this.GoodsReceivedNoteCols = [
      { headerName: 'GRN No', field: 'grnNo', sortable: true, filter: true },
      { headerName: 'PurchaseOrder No', field: 'purchaseOrderNumber', sortable: true, filter: true },
      { headerName: 'Warehouse', field: 'wareHouseName', sortable: true, filter: true, checkboxSelection: false },
      { headerName: 'Reference', field: 'supplierDeliveryReference', sortable: true, filter: true },
      { headerName: 'Vendor', field: 'vendorAccountName', sortable: true, filter: true },
      { headerName: 'Received-Date', field: 'receivedDate', sortable: true, filter: true },
      { headerName: 'Purchase Status ', field: 'statusName', sortable: true, filter: true },
      { headerName: 'Reversed ', field: 'isReversed', sortable: true, filter: true },
      { headerName: 'Invoiced ', field: 'isInvoiced', sortable: true, filter: true },
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: false }
     
    ];
  }
  
  GetOrderaudit(){
    this.AgLoad = false;
    debugger;
    this.purchaseOrderService.GetOrderaudit(this.PurchaseOrderID,this.CompanyID).subscribe((resp: any) => {
      console.log(resp);
      this.GoodsReceivedNotes=resp.data.auditdata;
      this.GoodsReceivedNotes.forEach(element => {
        debugger;
        let receivedDate = {'value': element.receivedDate}
        element.receivedDate=this.sharedFormatterService.dateTimeFormatter(receivedDate);
      });
      //this.VendorWareHouse = resp.data.vendorWareHouse;
       this.AgLoad = true;
      // this.Loading = false;
    
    }, (error) => {

      // this.Loading = false;
     this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  OnActionClick(event: any) {
    debugger;
    var colId = event.column.getId();

      console.log(event.data.id)
      //pur/goods-received-note/:id
      this.router.navigate(['pur/goods-received-note/' +event.data.id+ ``]); 
      
    
  }
  SelectPurchaseOrder(ID) {
    this.router.navigate(['pur/goods-received-note/' +ID+ ``]); 
      
  }
}

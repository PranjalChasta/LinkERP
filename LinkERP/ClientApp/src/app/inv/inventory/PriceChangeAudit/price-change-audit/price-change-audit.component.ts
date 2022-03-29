import { Component, OnInit } from '@angular/core';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';

@Component({
  selector: 'app-price-change-audit',
  templateUrl: './price-change-audit.component.html',
  styleUrls: ['./price-change-audit.component.css']
})
export class PriceChangeAuditComponent implements OnInit {
  ColumnDefs;
  RowData: any;
  AgLoad: boolean = false;
  Mode: any = 'List';
  constructor(private invCommon:InvCommonService) { }

  ngOnInit() {
    this.ColumnDefs = [
      { headerName: 'Product Name', field: 'productName', sortable: true, filter: true },
      { headerName: 'OLD Price ', field: 'oldPrice', sortable: true, filter: true,},
      { headerName: 'New Price ', field: 'newPrice', sortable: true, filter: true,},
     
      { headerName: 'Price Change Reason', field: 'priceChangeReason', sortable: true, filter: true,},
      { headerName: 'Price Change Machine', field: 'priceChangeMachine', sortable: true, filter: true },
      
      { headerName: 'Status', field: 'deleteStatus', type: 'DeleteStatus' },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: true, },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: true }
    ];
    this.BindInventories();
  }
  BindInventories() {
    this.AgLoad = false;
    this.Mode = "List";
    this.invCommon.getAllPriceAudit().subscribe((resp: any) => {
      this.RowData = resp.data.price;
      console.log(resp);
      this.AgLoad = true;
    }, (error) => {
    
      console.error('Problem with the sevice. Please try later : ' + error);
    });
}
}

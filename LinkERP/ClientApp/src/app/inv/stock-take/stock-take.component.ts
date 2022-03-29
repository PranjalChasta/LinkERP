import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LBS_INV_StockTake } from 'src/app/models/inv/LBS_INV_StockTake';
import { StockTakeService } from '../services/stock-take.service';
import * as moment from 'moment';

@Component({
  selector: 'app-stock-take',
  templateUrl: './stock-take.component.html',
  styleUrls: ['./stock-take.component.css']
})
export class StockTakeComponent implements OnInit {
  @Input() HeaderNames: any;
  @Input() RecID: any;
  @Input() write_Access: boolean;
  @Input() delete_Access: boolean;
  @Input() IsActive: boolean;
  @Input() ProductID: any;
  clstocktake = new LBS_INV_StockTake();
  transferDetails: any = [];
  AgLoad: boolean = false;
  ColumnDefs;
  Mode: any = "List";
  RowData: any;
  Loading: boolean;
  PageSize: any;
  Currentpage: string;
  RowIndex: any;
  IsEdit: boolean;
  constructor(private stocktakeServ: StockTakeService, private router: Router,
    private route: ActivatedRoute,) { }

  ngOnInit() {
    this.AgLoad = false;
    this.ColumnDefs = [
      { headerName: 'Code', field: 'transactionCode', sortable: true, filter: true, width: 80 },
      { headerName: 'Type', field: 'transactionType', sortable: true, filter: true, width: 105 },
      { headerName: 'Qty', field: 'quantity', sortable: true, filter: true, type: 'numericColumn', width: 100 },
      { headerName: 'WarehouseName', field: 'wareHouseName', sortable: true, filter: true, width: 120 },
      { headerName: 'Cost In', field: 'costIn', sortable: true, filter: true, type: 'numericColumn', width: 95 },
      { headerName: 'Adjustment Reason', field: 'adjustmentReason', sortable: true, filter: true, width: 150 },
      { headerName: 'Reference', field: 'sourceReference', sortable: true, filter: true, width: 130 },
      { headerName: 'Created Date', field: 'dateCreated', sortable: true, filter: true, valueFormatter: this.dateFormatter, width: 120 },
      { headerName: '', field: 'Edit', cellRenderer: this.CustomEditIconFunc, type: 'Action', hide: false }
    ];
    this.GetStockTakeDetails(this.RecID);
  }
  GetStockTakeDetails(ProductID) {
    debugger;
    this.stocktakeServ.GetStockTakeDetails(ProductID).subscribe((resp: any) => {
      this.RowData = resp.data.stockTakeDetails.filter(r => r.transactionCode == 3)
      this.AgLoad = true;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  dateFormatter(params) {
    return moment(params.value).format('DD/MM/yyyy'); //hh:mm:ss
  }
  CustomEditIconFunc(params): string {
    let cellContent: string = '<div style="cursor: pointer;"  ><i class="bi fa fa-align-justify" aria-hidden="true"></i></i></div>';
    return cellContent
  }
  OnActionClick(event: any) {
    debugger;
    var colId = event.column.getId();
    if (colId == 'Edit') {
      debugger;
      this.Edit(event.data)
    }
  }
  Edit(event) {
    this.router.navigate(['/inv/inventorystocktake/' + event.sourceReference + ``]);
  }
}

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LbsSysNotes } from 'src/app/models/sys/lbs-sys-notes';
import { NoteService } from 'src/app/shared/services/note.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { CustomValidators } from 'ngx-custom-validators';
import { SharedFormatterService } from 'src/app/shared/services/shared-formatter.service';
import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { LBS_INV_TransactionHistory } from 'src/app/models/inv/LBS_INV_TransactionHistory';
import { HistoryService } from '../services/history.service';
import * as moment from 'moment';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  @Input() HeaderNames: any;
  @Input() RecID: any;
  @Input() write_Access: boolean;
  @Input() delete_Access: boolean;
  @Input() IsActive: boolean;
  @Input() ProductID: any;
  transactionHistory = new LBS_INV_TransactionHistory();
  transactionhistoryDetails: any = [];
  AgLoad: boolean = false;
  ColumnDefs;
  Mode: any = "List";
  RowData: any;
  Loading: boolean;
  PageSize: any;
  Currentpage: string;
  RowIndex: any;
  IsEdit: boolean;
  constructor(private historyServ: HistoryService, private router: Router,
    private route: ActivatedRoute,) { }

  ngOnInit() {
    this.AgLoad = false;

    this.ColumnDefs = [
      // { headerName: 'Code', field: 'transactionCode', sortable: true, filter: true, width: 80 },
      { headerName: 'Type', field: 'transactionType', sortable: true, filter: true, width: 105 },
      { headerName: 'Qty', field: 'quantity', sortable: true, filter: true, cellStyle: { textAlign: 'left' }, },
      { headerName: 'WarehouseName', field: 'wareHouseName', sortable: true, filter: true },
      { headerName: 'Cost In', field: 'costIn', sortable: true, filter: true, cellStyle: { textAlign: 'left' },},
      { headerName: 'Cost Out', field: 'costOut', sortable: true, filter: true, cellStyle: { textAlign: 'left' },},
      { headerName: 'Adjustment Reason', field: 'reason', sortable: true, filter: true },
      { headerName: 'Reference', field: 'sourceReference', sortable: true, filter: true },
      { headerName: 'Created Date', field: 'dateCreated', sortable: true, filter: true, valueFormatter: this.dateFormatter },
      { headerName: '', field: 'Edit', cellRenderer: this.CustomEditIconFunc, type: 'Action', hide: false }
    ];
    this.PageSize = "50";
    this.Currentpage = "0";
    this.GetTransactionDetails(this.RecID);
  }
  GetTransactionDetails(ProductID) {
    debugger;
    this.historyServ.GetTransactionHistoryDetails(ProductID).subscribe((resp: any) => {
      this.RowData = resp.data.transactionDetails;
      console.log(this.RowData);
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
    console.log(event);
    debugger;
    if (event.transactionType == 'Adjustment')
      this.router.navigate(['/inv/inventory-adjustment/' + event.sourceReference + ``]);
    else if (event.transactionType == 'StockTake')
      this.router.navigate(['/inv/inventorystocktake/' + event.sourceReference + ``]);
    else if (event.transactionType == 'Transfer')
      this.router.navigate(['/inv/inventorytransfer/' + event.sourceReference + ``]);
    else if (event.transactionType == 'GRN')
      this.router.navigate(['/pur/goods-received-note/' + event.id + ``]);
    else {

    }
  }
}

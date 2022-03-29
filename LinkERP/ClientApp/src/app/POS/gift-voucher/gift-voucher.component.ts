import { Component, OnInit } from '@angular/core';
import { GiftVoucherService } from '../services/gift-voucher.service';
import { ToastrService } from 'ngx-toastr';
import { SharedFormatterService } from 'src/app/shared/services/shared-formatter.service';

@Component({
  selector: 'app-gift-voucher',
  templateUrl: './gift-voucher.component.html',
  styleUrls: ['./gift-voucher.component.css']
})
export class GiftVoucherComponent implements OnInit {
  ColumnDefs;
  RowData: any;
  PageSize: any;
  Currentpage: any;
  AgLoad: boolean;
  constructor(
    private giftVoucherServcie:GiftVoucherService,
    private toastr:ToastrService,
    private sharedFormatterService:SharedFormatterService
    ) { }

  ngOnInit() {
    this.GetAgColumns();
    this.GetGiftVoucherList();
    this.PageSize = "10";
    this.Currentpage = "0";
  }

  GetAgColumns() {
    this.ColumnDefs = [
      //{ headerName: 'GiftVoucherSerial', field: 'giftVoucherSerial', sortable: true, filter: true },
      { headerName: 'IssuedDate', field: 'issuedDate', sortable: true, filter: true,valueFormatter: this.sharedFormatterService.dateFormatter  },
      { headerName: 'ExpiryDate', field: 'expiryDate', sortable: true, filter: true,valueFormatter: this.sharedFormatterService.dateFormatter  },
      { headerName: 'VoucherValue', field: 'voucherValue', sortable: true, filter: true },
      { headerName: 'Status', field: 'status', sortable: true, filter: true}

    ];
  }
  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }

  GetGiftVoucherList(){
    this.giftVoucherServcie.GetGiftVoucherList().subscribe((res:any)=>{
      console.log(res);
      this.RowData =res.data.giftVouchers;
      this.AgLoad=true;
      console.log(this.RowData);
    }, (error) => {
      this.toastr.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  


}

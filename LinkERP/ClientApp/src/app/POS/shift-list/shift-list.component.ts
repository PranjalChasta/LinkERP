import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CryptoAes } from 'src/app/directives/crypto-aes';
import { CustomValidators } from 'ngx-custom-validators';
import { ShiftListService } from '../services/shift-list.service';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';
import { LbsPosQuotation } from 'src/app/models/pos/lbs_pos_quotation';
import { SharedFormatterService } from 'src/app/shared/services/shared-formatter.service';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { GenricTableIDByName } from 'src/app/shared/enums/enum-generictables';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shift-list',
  templateUrl: './shift-list.component.html',
  styleUrls: ['./shift-list.component.css']
})
export class ShiftListComponent implements OnInit {
  ColumnDefs;
  RowData: any = [];
  PageSize: any;
  Currentpage: any;
  AgLoad: boolean;
  Loading: any = false;
  Menuaccess:any="ShiftList";
  public shiftID: any;
  constructor(private toastr: ToastrService,
    private cryptoAes: CryptoAes,
    private FB: FormBuilder,
    private invCommonService: InvCommonService,
    private shiftlistServcie: ShiftListService,
    private sharedFormatterService: SharedFormatterService,
    private sysCommonService: SysCommonService,
    private modalService: BsModalService,private router: Router) { }

  ngOnInit() {
    //debugger;
    this.GetShiftColumns();
    this.GetShiftList();
  }
  GetShiftColumns() {
    this.ColumnDefs = [
      { headerName: 'Shift No', field: 'shift', sortable: true, filter: true },
      { headerName: 'Location', field: 'location', sortable: true, filter: true },
      { headerName: 'User', field: 'user', sortable: true, filter: true },
      { headerName: 'Open Time', field: 'openTime', sortable: true, filter: true },
      { headerName: 'Count', field: 'count', sortable: true, filter: true },
      { headerName: 'Total Sales', field: 'totalSales', sortable: true, filter: true },
      { headerName: 'Till Amount', field: 'tillAmount', sortable: true, filter: true },
      { headerName: 'Status', field: 'status', sortable: true, filter: true },
      { headerName: 'Close', field: '', sortable: false, filter: false },
    ];
  }

  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  GetShiftList() {
    this.Loading = true;
    this.AgLoad = false;

    this.shiftlistServcie.GetShiftList().subscribe((res: any) => {
      //debugger;
      this.RowData = res.data;
      console.log(this.RowData)
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.Loading = false;
      this.toastr.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  SelectedShift(shiftId) {
    //alert('Selected Shift is:' + shiftId);
    //debugger;
    this.shiftID = shiftId;
    this.Menuaccess="closeshift";
    //alert('Selected Shift is:' + this.shiftID);
    //this.router.navigate(['/pos/close-shift']);
  }
}

import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
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
import { ShiftListComponent } from '../shift-list/shift-list.component';
import { inputs } from '@syncfusion/ej2-angular-dropdowns/src/drop-down-list/dropdownlist.component';

@Component({
  selector: 'app-close-shift',
  templateUrl: './close-shift.component.html',
  styleUrls: ['./close-shift.component.css']
})
export class CloseShiftComponent implements OnInit {
  ColumnDefs;
  RowData: any;
  public receiptData: any;
  PageSize: any;
  Currentpage: any;
  AgLoad: boolean;
  Loading: any = false;
  public shiftId: any;
  public companyId: any;
  public shiftNo: any;
  currentDate: any = Date();
  cashier: string;
  @Input() ShiftID: any;
  hideScreen: any = false;
  //@Output() shiftID = new EventEmitter();
  @Input() shiftDetailsData: any;
  public reconcileVal: any;
  public tillAmountVal: any;
  Menuaccess: any = "closeshift";
  public paymentValues: any = [];
  systemAmt: number = 0.00;
  tillAmount: number = 0.00;
  varianceAmt: number = 0.00;
  public tillAmtValues: any = [];
  public shiftIds: any = [];
  public checkedList: any = [];
  //@Input() shiftlistCompont: ShiftListComponent;
  constructor(private toastr: ToastrService,
    private cryptoAes: CryptoAes,
    private FB: FormBuilder,
    private invCommonService: InvCommonService,
    private shiftlistServcie: ShiftListService,
    private sharedFormatterService: SharedFormatterService,
    private sysCommonService: SysCommonService,
    private modalService: BsModalService, private router: Router) { }

  ngOnInit() {
    //debugger;
    console.log(this.ShiftID);
    //alert(this.shiftID);
    //this.ShiftID = this.shiftID;
    //alert(this.ShiftID);
    this.currentDate = new Date().toLocaleDateString();
    this.cashier = localStorage.getItem('LoginID').toString();
    this.GetShiftDetails(this.ShiftID);
    //this.systemAmt = this.tillAmount + this.varianceAmt;
    //alert(this.systemAmt);
    //this.GetReceiptDetails(this.companyId, this.ShiftID);
  }

  OnPageSizeChange($event: any) {
    this.PageSize = $event.target.value;
  }
  OnchangeCurrentpage(page) {
    this.Currentpage = page;
  }
  onCheckboxChange(e) {
    //debugger;
    this.reconcileVal = e.target.checked;
    //this.receiptData = data;
    // for (var i = 0; i < this.tillAmtValues.length; i++) {
    //   let newTillValues = {
    //     tillAmount: this.tillAmtValues[i].tillAmount
    //   };
    //   this.receiptData[i].tillAmount = newTillValues.tillAmount;
    // }
    //this.receiptData[i].tillAmount = tillAmt;
  }
  ontextChange(e) {
    //alert(this.tillAmountVal);
    this.tillAmountVal = e.target.value;
  }
  GetShiftDetails(shiftID) {
    //this.Loading = true;
    //this.AgLoad = false;

    this.shiftlistServcie.GetShiftDetail(shiftID).subscribe((res: any) => {
      //debugger;
      this.RowData = res.data;
      this.companyId = res.data[0].companyID;
      this.shiftNo = res.data[0].shiftNo;
      this.Loading = false;
      this.AgLoad = true;
      this.GetReceiptDetails(this.companyId, this.ShiftID);
    }, (error) => {
      this.Loading = false;
      this.toastr.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  GetReceiptDetails(companyId, shiftID) {
    this.Loading = true;
    this.AgLoad = false;

    this.shiftlistServcie.GetReceiptDetails(companyId, shiftID).subscribe((res: any) => {
      //debugger;
      this.receiptData = res.data;
      //this.paymentValues = res.data;
      console.log(this.receiptData);
      this.Loading = false;
      this.AgLoad = true;
    }, (error) => {
      this.Loading = false;
      this.toastr.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  SelectedShift(shiftId) {
    //alert('Selected Shift is:' + shiftId);
    this.router.navigate(['/pos/close-shift']);
  }
  NextClick() {
    //debugger;
    if (this.reconcileVal == false) {
      this.toastr.error('Please Reconcile Payment Method');
      return;
    }
    else {
      if (this.reconcileVal == true) {
        for (var i = 0; i < this.checkedList.length; i++) {
          let newIds = {
            shiftId: this.checkedList[i],
            reconcile: 1
          };
          this.receiptData[i].id = newIds.shiftId;
          this.receiptData[i].reconcile = newIds.reconcile;
        }
        for (var i = 0; i < this.tillAmtValues.length; i++) {
          let newTillValues = {
            tillAmount: this.tillAmtValues[i].tillAmount
          };
          this.receiptData[i].tillAmount = newTillValues.tillAmount;
        }

        for (const obj of this.receiptData) {
          if (obj.reconcile == 1) {
            let newPaymentValues = {
              paymentID: obj.id,
              paymentType: obj.paymentType,
              amount: obj.amount,
              //tillAmount: this.tillAmtValues
              tillAmount: obj.tillAmount
            };
            this.paymentValues.push(newPaymentValues);
            //console.log(this.paymentValues);
            //debugger;
            this.systemAmt = this.systemAmt + parseFloat(newPaymentValues.amount);
            this.tillAmount = this.tillAmount + parseFloat(newPaymentValues.tillAmount);
            this.varianceAmt = this.systemAmt - this.tillAmount;
          }
        }
        this.Menuaccess = "paymentcloseshift";
      }
      //this.router.navigate(['/pos/payment-close-shift']);
    }
  }
  ontillamtChange(tillAmt) {
    let newPaymentValues = {
      tillAmount: tillAmt
    };
    this.tillAmtValues.push(newPaymentValues);
  }
  Cancel() {
    //this.router.navigate(['/pos/shift-list']);
    this.Menuaccess = "ShiftList";

  }
  onChangeChkbx($event) {
    //debugger;
    //new changes
    this.reconcileVal = $event.target.checked;
    var values = $event.target.value;
    this.receiptData = values.split('/');
    if ($event.target.checked) {
      this.shiftIds.push(this.receiptData[0]);
      //alert(this.shiftIds);
    } else {
      const index: number = this.shiftIds.indexOf(this.receiptData[0]);
      if (index == -1) {
        this.shiftIds.splice(index, 1);
      }
      {
        this.shiftIds = [];
      }
    }
  }
  onCheckbxChange(option, event) {
    //debugger;
    this.reconcileVal = event.target.checked;
    if (event.target.checked) {
      this.checkedList.push(option.id);
    } else {
      for (var i = 0; i < this.receiptData.length; i++) {
        if (this.checkedList[i] == option.id) {
          this.checkedList.splice(i, 1);
        }
      }
    }
    console.log(this.checkedList);
  }
}

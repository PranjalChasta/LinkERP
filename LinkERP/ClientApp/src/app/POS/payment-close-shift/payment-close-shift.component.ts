import { Component, Input, OnInit, TemplateRef } from '@angular/core';
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
import { LbsSopShift } from 'src/app/models/pos/lbs-sop-shift';
import { LbsSopShiftDetail } from 'src/app/models/pos/lbs-sop-shift-detail';
import { Location } from '@angular/common';

@Component({
  selector: 'app-payment-close-shift',
  templateUrl: './payment-close-shift.component.html',
  styleUrls: ['./payment-close-shift.component.css']
})
export class PaymentCloseShiftComponent implements OnInit {
  @Input() shiftID: any;
  @Input() shiftNumber: any;
  @Input() cashier: any;
  currentDate: any = Date();
  Menuaccess: any = "paymentcloseshift";
  @Input() paymentValues: any;
  @Input() tillAmount: number = 0;
  @Input() systemAmount: number = 0;
  @Input() varianceAmount: number = 0;
  public isChecked: any = false;
  newpaymentVals: any = [];
  totalsystemAmt: number = 0;
  totaltillAmount: number = 0;
  totalvarianceAmount: number = 0;
  public paymentID: any;
  constructor(private toastr: ToastrService,
    private FB: FormBuilder,
    private invCommonService: InvCommonService,
    private shiftlistServcie: ShiftListService,
    private sharedFormatterService: SharedFormatterService,
    private sysCommonService: SysCommonService,
    private modalService: BsModalService, private router: Router, private location: Location) { }

  ngOnInit() {
    //debugger;
    this.currentDate = new Date().toLocaleDateString();
    // alert(this.cashier);
    // alert(this.shiftNumber);
    var systemAmount = this.systemAmount.toFixed(2);
    var tillAmount = this.tillAmount.toFixed(2);
    var varianceAmount = this.varianceAmount.toFixed(2);
    //alert(varianceAmount);
    console.log(this.paymentValues);
  }
  onCheckboxChange(val) {
    this.isChecked = val;
  }
  PartialClose() {
    //debugger;
    if (this.isChecked) {
      let lbssopshift = new LbsSopShift();
      lbssopshift.ID = this.shiftID;
      lbssopshift.ShiftNo = this.shiftNumber;
      lbssopshift.CompanyID = localStorage.getItem('CompanyID');
      lbssopshift.SystemTotal = this.systemAmount;
      lbssopshift.TillTotal = this.tillAmount;
      lbssopshift.Variance = this.varianceAmount;
      lbssopshift.Status = "1";
      lbssopshift.Action = "Update";
      lbssopshift.CreatedBY = localStorage.getItem('LoginID');
      this.shiftlistServcie.CloseShift(lbssopshift).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.AddShiftDetail();
          this.Menuaccess = "ShiftList";
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    else {
      this.toastr.error('Select Accept Variance Amount');
    }
  }
  FullClose() {
    //debugger;
    if (this.isChecked) {
      let lbssopshift = new LbsSopShift();
      lbssopshift.ID = this.shiftID;
      lbssopshift.ShiftNo = this.shiftNumber;
      lbssopshift.CompanyID = localStorage.getItem('CompanyID');
      lbssopshift.SystemTotal = this.systemAmount.toFixed(2);
      lbssopshift.TillTotal = this.tillAmount.toFixed(2);
      lbssopshift.Variance = this.varianceAmount.toFixed(2);
      lbssopshift.Status = "2";
      lbssopshift.Action = "Update";
      lbssopshift.CreatedBY = localStorage.getItem('LoginID');
      this.shiftlistServcie.CloseShift(lbssopshift).subscribe((resp: any) => {
        if (resp.isSuccess) {
          this.AddShiftDetail();
          this.Menuaccess = "ShiftList";
        }
      }, (error) => {
        console.error('Problem with the sevice. Please try later : ' + error.message);
      });
    }
    else {
      this.toastr.error('Select Accept Variance Amount');
    }
  }
  Back() {
    this.Menuaccess = "closeshift";
  }
  Cancel() {
    this.router.navigate(['/home']);
  }
  AddShiftDetail() {
    debugger;
    for (var i = 0; i < this.paymentValues.length; i++) {
      let newPaymentValues = {
        paymentID: this.paymentValues[i].paymentID,
        paymentType: this.paymentValues[i].paymentType,
        amount: this.paymentValues[i].amount,
        tillAmount: this.paymentValues[i].tillAmount
      };
      this.newpaymentVals.push(newPaymentValues);
      console.log(this.paymentValues);
      this.totalsystemAmt = this.systemAmount + parseFloat(this.newpaymentVals[i].amount);
      this.totaltillAmount = this.tillAmount + parseFloat(this.newpaymentVals[i].tillAmount);
      this.totalvarianceAmount = this.totalsystemAmt - this.totaltillAmount[i];
      this.paymentID = this.newpaymentVals[i].paymentID;
    }
    let lbssopshiftDetail = new LbsSopShiftDetail();
    lbssopshiftDetail.ShiftID = this.shiftID;
    lbssopshiftDetail.PaymentType = this.paymentID;
    lbssopshiftDetail.CompanyID = localStorage.getItem('CompanyID');
    lbssopshiftDetail.SystemTotal = this.systemAmount.toFixed(2);
    lbssopshiftDetail.TillTotal = this.tillAmount.toFixed(2);
    lbssopshiftDetail.Variance = this.varianceAmount.toFixed(2);
    lbssopshiftDetail.Currency = "";
    lbssopshiftDetail.MultiCurrency = true;
    lbssopshiftDetail.CloseAuthorisedBy = this.cashier;
    lbssopshiftDetail.SystemTotalHome = this.systemAmount.toFixed(2);
    lbssopshiftDetail.TillTotalHome = this.tillAmount.toFixed(2);
    lbssopshiftDetail.VarianceHome = this.varianceAmount.toFixed(2);
    lbssopshiftDetail.CreatedBY = localStorage.getItem('LoginID');
    this.shiftlistServcie.ShiftDetails(lbssopshiftDetail).subscribe((resp: any) => {
      if (resp.isSuccess) {
        this.Menuaccess = "ShiftList";
      }
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error.message);
    });
  }
  ClosePartial() {
    this.PartialClose();
  }
  CloseFull() {
    this.FullClose();
  }
}

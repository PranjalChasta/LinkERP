import { Component, OnInit, EventEmitter, Output, Input, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SopOrderService } from '../../services/sop-order.service';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.css']
})
export class PaymentMethodsComponent implements OnInit {
  PaymentMethodForm: FormGroup;
  total: any = 0.00;
  surcharge: any = 0.00;
  paymentAmount: any = 0.00;
  @Input() paymentList: any = [];
  @Input() newPaymentAmount: any;
  amountDue: any = 0.00;
  totalPayment: any = 0.00;
  balance: any = 0.00;
  rounding: any = 0.00;
  modalRef: BsModalRef;
  Mode: any = "PaymentMethod";
  @Input() PaymentMode: any;
  paymentData: any = [];
  @Output() Cancel = new EventEmitter();
  @Output() paymentmodeDetails = new EventEmitter<any>();
  @Input() TotalAmount: any;
  additionalDetails: any;
  @Input() selectedTenderID: any;
      Paymentdetail1:any='';
      Paymentdetail2: any='';;
      Paymentdetail3:any='';;  
      Paymentdetail4:any='';;
      Paymentdetail5:any='';;
      Paymentdetail6: any='';;
      Paymentdetail7: any='';;
      Paymentdetail8:any='';;
  constructor(private modalService: BsModalService, private soporderService: SopOrderService
    ,private FB: FormBuilder) { }

  ngOnInit() {
    debugger;
    this.getTenderTypeBYID(this.selectedTenderID);
    this.paymentDetails();
  }
  GetPayment() {
   // this.paymentData=[];
    /* if (this.paymentList.length > 0) {
      for (var i = 0; i < 1; i++) {
        this.paymentList.push({ 'Paymentmode': this.PaymentMode, 'Amount': this.paymentAmount, 'ReceivedAmount': this.paymentAmount, 'TotalDue': this.amountDue  , 'Paymentdetail1': this.Paymentdetail1,
        'Paymentdetail2':  this.Paymentdetail2,
        'Paymentdetail3': this.Paymentdetail3, 
        'Paymentdetail4':this.Paymentdetail4,
        'Paymentdetail5':this.Paymentdetail5,
        'Paymentdetail6': this.Paymentdetail6,
        'Paymentdetail7': this.Paymentdetail7,
        'Paymentdetail8':this.Paymentdetail8});
        this.paymentData = this.paymentList;
      }
    }
    else {
      this.paymentData.push({ 'Paymentmode': this.PaymentMode, 'Amount': this.paymentAmount, 'ReceivedAmount': this.paymentAmount , 'Paymentdetail1': this.Paymentdetail1,
      'Paymentdetail2':  this.Paymentdetail2,
      'Paymentdetail3': this.Paymentdetail3, 
      'Paymentdetail4':this.Paymentdetail4,
      'Paymentdetail5':this.Paymentdetail5,
      'Paymentdetail6': this.Paymentdetail6,
      'Paymentdetail7': this.Paymentdetail7,
      'Paymentdetail8':this.Paymentdetail8});
    } */
    this.paymentData.push(
    { 'Paymentmode': this.PaymentMode,
      'Amount': this.paymentAmount,
      'ReceivedAmount': this.paymentAmount ,
      'Paymentdetail1': this.Paymentdetail1,
      'Paymentdetail2':  this.Paymentdetail2,
      'Paymentdetail3': this.Paymentdetail3, 
      'Paymentdetail4':this.Paymentdetail4,
      'Paymentdetail5':this.Paymentdetail5,
      'Paymentdetail6': this.Paymentdetail6,
      'Paymentdetail7': this.Paymentdetail7,
      'Paymentdetail8':this.Paymentdetail8
    });
    //this.Mode = 'PaymentScreen';
    console.log(this.paymentData)
    this.paymentmodeDetails.emit(this.paymentData);
    this.Cancel.emit();
  }
  closePopUp() {
    this.Cancel.emit();
  }
  paymentDetails() {
    debugger;
    if (this.paymentList.length == 1) {
      for (var i = 0; i < 1; i++) {
        // this.paymentList.push({ 'Paymentmode': this.PaymentMode, 'Amount': this.paymentAmount, 'ReceivedAmount': this.paymentAmount });
        this.paymentData = this.paymentList;

        this.paymentAmount = this.TotalAmount - this.newPaymentAmount;
        this.amountDue = this.TotalAmount
        this.totalPayment = this.paymentAmount;
      }
    }
    else if (this.paymentList.length == 2) {
      for (var i = 1; i < 2; i++) {
        // this.paymentList.push({ 'Paymentmode': this.PaymentMode, 'Amount': this.paymentAmount, 'ReceivedAmount': this.paymentAmount });
        this.paymentData = this.paymentList;
        this.paymentAmount = this.TotalAmount - this.newPaymentAmount;
        this.amountDue = this.TotalAmount
        this.totalPayment = this.paymentAmount;
      }
    }
    else if (this.paymentList.length == 3) {
      for (var i = 2; i < 3; i++) {
        // this.paymentList.push({ 'Paymentmode': this.PaymentMode, 'Amount': this.paymentAmount, 'ReceivedAmount': this.paymentAmount });
        this.paymentData = this.paymentList;
        this.paymentAmount = this.paymentData[i].Amount - this.paymentData[i].Amount;
        this.amountDue = this.TotalAmount
        this.totalPayment = this.paymentAmount;
      }
    }
    else {
      //  this.paymentData.push({ 'Paymentmode': this.PaymentMode, 'Amount': this.paymentAmount, 'ReceivedAmount': this.paymentAmount });
      this.amountDue = this.TotalAmount
      this.paymentAmount = this.TotalAmount; // - this.paymentData[0].Amount;
      this.totalPayment = this.paymentAmount;
    }

  }
  onchangePayment(paymentAmt) {
    this.totalPayment = paymentAmt;
  }
  getTenderTypeBYID(tenderID) {
    debugger;
    this.soporderService.getTenderTypeByID(tenderID).subscribe((response: any) => {
      if (response.isSuccess)
        this.additionalDetails = response.data.tenderTypes;
        
      if (this.additionalDetails[0].caption1 && this.additionalDetails[0].caption2 && this.additionalDetails[0].caption3 && this.additionalDetails[0].caption4 && this.additionalDetails[0].caption5 && this.additionalDetails[0].caption6 && this.additionalDetails[0].caption7 && this.additionalDetails[0].caption8 != null) {
        this.additionalDetails = response.data.tenderTypes;
      }
      else {
        this.additionalDetails = [];
      }
    })
  }

  get f() { return this.PaymentMethodForm.controls; }
  CreateForm() {
    this.PaymentMethodForm = this.FB.group({
      ID: [''],
      Paymentdetail1: [''],
      Paymentdetail2: [''],
      Paymentdetail3: [''],
      Paymentdetail4: [''],
      Paymentdetail5: [''],
      Paymentdetail6: [''],
      Paymentdetail7: [''],
      Paymentdetail8: ['']  
    })
  }
}

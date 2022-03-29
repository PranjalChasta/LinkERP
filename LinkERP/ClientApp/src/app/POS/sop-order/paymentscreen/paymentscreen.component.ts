import { Component, OnInit, EventEmitter, Output, Input, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LbsSopOrderMain } from 'src/app/models/pos/lbs_sop_ordermain';
import { SopOrderService } from '../../services/sop-order.service';
import { LBS_SOP_ReceiptsDetail } from 'src/app/models/pos/lbs_sop_reciptdetails';
import { number } from 'ngx-custom-validators/src/app/number/validator';

@Component({
  selector: 'app-paymentscreen',
  templateUrl: './paymentscreen.component.html',
  styleUrls: ['./paymentscreen.component.css']
})
export class PaymentscreenComponent implements OnInit {
  @Input() ProductDetails: any = [];
  @Input() PaymentData: any = [];
  @Input() selectedDebtorID: any;
  @Input() WarehouseID: any;
  @Input() InventoryId: any;
  @Input() OrderMainID: any;
  @Output() Cancel = new EventEmitter();
  @Output() OnComplete = new EventEmitter<{ReceiptDetails:any, Change:string}>();
  total: any = 0;
  totalTax: any = 0;
  totalDiscount: any = 0;
  totalDue: any = 0;
  received: any = 0;
  balanceDue: any = 0;
  modalRef: BsModalRef;
  @Input() PaymentAmount: any;
  public Paymentmode: any;
  Mode: any = 'PaymentScreen';
  balanceChange: any = 0;
  tenderTypes: any;
  tenderID: any;
  reciptdetail:any=[];
  CustomerGivenChange:any;
  constructor(private modalService: BsModalService, public toastr: ToastrService, private soporderService: SopOrderService) { }

  ngOnInit() {
    this.getTenderTypes();
    this.paymentDetails();
    this.reciptdetail=[];
  }
  paymentDetails() {
    debugger;
    for (var i = 0; i < this.ProductDetails.length; i++) {
      this.total += parseFloat(this.ProductDetails[i].lineTotalIncludingTax);
      this.totalDue = this.total;
      //this.total = this.total.toFixed(2);
    }
  }
  paymentmodeDetails(event) {
    debugger;
   this.PaymentData = event;
   this.CalculateReceiveChane();
//     if (this.PaymentData.length > 1) {
//       for (var i = 1; i < this.PaymentData.length; i++) {
//         this.received += parseFloat(this.PaymentData[i].ReceivedAmount);
//         this.received = this.received;
//         this.totalDue = this.total - this.received;
//       }
//     }
//     else {
//       this.received = parseFloat(this.PaymentData[0].ReceivedAmount);
//       this.received = this.received;
//       this.totalDue = this.total - this.received;
//     }
//     this.balanceChange = (this.received - this.total);
//     this.balanceChange = this.balanceChange.toFixed(2);
//     //this.received = this.received.toFixed(2);
//     this.modalRef.hide();
//     let lno;
//    lno=this.reciptdetail.length+1;
//     this.reciptdetail
//     let receiptsDetail = new LBS_SOP_ReceiptsDetail();
//     receiptsDetail.PaymentLineNo=lno;
//     receiptsDetail.WareHouseID=this.WarehouseID;
//     receiptsDetail.DebtorID=this.selectedDebtorID;
//     receiptsDetail.TransactionSourceReference=this.OrderMainID;
//     receiptsDetail.CreatedBY=localStorage.getItem('LoginName');
//     receiptsDetail.PaymentType=this.PaymentData[0].Paymentmode;
//     receiptsDetail.HomeAmount=this.total;
//     receiptsDetail.PaymentDetail1=this.PaymentData[0].Paymentdetail1;
//     receiptsDetail.PaymentDetail2=this.PaymentData[0].Paymentdetail2;
//     receiptsDetail.PaymentDetail3=this.PaymentData[0].Paymentdetail3;
//     receiptsDetail.PaymentDetail4=this.PaymentData[0].Paymentdetail4;
//     receiptsDetail.PaymentDetail5=this.PaymentData[0].Paymentdetail5;
//     receiptsDetail.PaymentDetail6=this.PaymentData[0].Paymentdetail6;
//     receiptsDetail.PaymentDetail7=this.PaymentData[0].Paymentdetail7;
//     receiptsDetail.PaymentDetail8=this.PaymentData[0].Paymentdetail8;
//     receiptsDetail.CustomerPaidAmount=this.received;  


//      // receiptsDetail.PaymentType=this.PaymentData[0].Paymentmode;
//      // receiptsDetail.PaymentDetail1=this.PaymentData[0].Paymentdetail1;
//       this.reciptdetail.push(receiptsDetail);
//       console.log(this.reciptdetail)
  }
  CalculateReceiveChane(){
    var sum=0;
    debugger
    if (this.PaymentData.length > 0) {
      this.PaymentData.forEach(element => {
        sum=sum+Number(element.ReceivedAmount)
        this.received=sum;
      });
      this.CustomerGivenChange=Number(this.received)-Number(this.total);
    }
    else{
      this.received=sum;
      this.CustomerGivenChange=0;
    }

  }
  closePopUp() {
    //this.Mode = 'OrderDetail';
    this.modalRef.hide();
  }
  OnPayment(cash: TemplateRef<any>, description, id) {
    debugger;
    this.tenderID = id;
    this.Paymentmode = description;
    this.modalRef = this.modalService.show(cash);
  }
  OnCredit(credit: TemplateRef<any>, paymentMode) {
    this.Paymentmode = paymentMode;
    this.modalRef = this.modalService.show(credit);
  }
  OnCheque(cheque: TemplateRef<any>, paymentMode) {
    this.Paymentmode = paymentMode;
    this.modalRef = this.modalService.show(cheque);
  }
  OnCred(cred: TemplateRef<any>, paymentMode) {
    this.Paymentmode = paymentMode;
    this.modalRef = this.modalService.show(cred);
  }
  
  OnCompletePayment() {
    debugger;
    if (this.total > this.received) {

      this.toastr.error('The due amount has not been settled in full. Payment is required !!.')
    }
    else {
      this.ReceiptDetails();
      this.OnComplete.emit({ReceiptDetails:this.ReceiptDetails(),Change:this.CustomerGivenChange});
    
      
      /* let lbsOrder = new LbsSopOrderMain();
      lbsOrder.CompanyID = localStorage.getItem('CompanyID');
      lbsOrder.DebtorID = this.selectedDebtorID;
      lbsOrder.WarehouseID = this.WarehouseID;
      lbsOrder.ShiftID = localStorage.getItem('ShiftID');
      lbsOrder.InvoiceTotal = this.received;
      lbsOrder.DebtorContactName = 'POS' + '' + this.Paymentmode;
      lbsOrder.CreatedBY = localStorage.getItem('LoginID');
      lbsOrder.SalesOrderType = this.Paymentmode + '' + 'Sales';
      lbsOrder.Status = true;

      this.soporderService.AddOrderMain(lbsOrder).subscribe((response: any) => {
        if (response.isSuccess) {
          this.toastr.success(this.balanceChange);
        }
      }); */
    }
  }
  ReceiptDetails(){
   
       let lno=0;
       let Change=0;
       let TotalPaidAmount=0
debugger;
        this.reciptdetail=[];
        let receiptsDetailsss: LBS_SOP_ReceiptsDetail[] = [];
        this.PaymentData.forEach(PD => {
        lno=Number(lno)+1;
          let receiptsDetail = new LBS_SOP_ReceiptsDetail();
          receiptsDetail.PaymentLineNo=lno
        receiptsDetail.WareHouseID=this.WarehouseID;
        receiptsDetail.DebtorID=this.selectedDebtorID;
        receiptsDetail.TransactionSourceReference=this.OrderMainID;
        receiptsDetail.CreatedBY=localStorage.getItem('LoginName');
        receiptsDetail.PaymentType=PD.Paymentmode;
        receiptsDetail.HomeAmount=this.total;
        receiptsDetail.PaymentDetail1=PD.Paymentdetail1;
        receiptsDetail.PaymentDetail2=PD.Paymentdetail2;
        receiptsDetail.PaymentDetail3=PD.Paymentdetail3;
        receiptsDetail.PaymentDetail4=PD.Paymentdetail4;
        receiptsDetail.PaymentDetail5=PD.Paymentdetail5;
        receiptsDetail.PaymentDetail6=PD.Paymentdetail6;
        receiptsDetail.PaymentDetail7=PD.Paymentdetail7;
        receiptsDetail.PaymentDetail8=PD.Paymentdetail8;
        receiptsDetail.CustomerPaidAmount=PD.ReceivedAmount;
        TotalPaidAmount=PD.ReceivedAmount;
        if(Number(TotalPaidAmount) <= Number(this.total))
         { Change = 0;}
       else 
       {Change = Number(TotalPaidAmount) - Number(this.total) }
      receiptsDetail.CustomerChangeGiven=Change 
        receiptsDetailsss.push(receiptsDetail);
        });
      return receiptsDetailsss;
        
          
  }
  Deleteindex(payment, i) {
    debugger;
    this.PaymentData.splice(i, 1);
    this.CalculateReceiveChane();
    // if (this.PaymentData.length > 1) {
    //   for (i = 1; i < this.PaymentData.length; i++) {
    //     this.received -= parseFloat(this.PaymentData[i].ReceivedAmount);
    //     this.received = this.received;
    //     this.totalDue += payment.Amount;
    //   }
    // }
    // else if (this.PaymentData.length > 0) {
    //   this.received = parseFloat(this.PaymentData[0].ReceivedAmount);
    //   this.received = this.received;
    //   this.totalDue = this.total - parseFloat(this.PaymentData[0].Amount);
    // }
    // else {
    //   this.received = 0;
    //   this.totalDue = this.total;
    // }
  }
  getTenderTypes() {
    debugger;
    let CompanyID = localStorage.getItem('CompanyID');
    this.soporderService.getTenderTypes(CompanyID).subscribe((response: any) => {
      if (response.isSuccess)
        this.tenderTypes = response.data.tenderTypes;
    })
  }
  Close() {
    this.Cancel.emit();
  }

}

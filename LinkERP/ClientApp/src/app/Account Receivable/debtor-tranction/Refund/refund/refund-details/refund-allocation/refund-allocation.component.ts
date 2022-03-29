import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LBS_SOP_RefundsAllocation } from 'src/app/Account Receivable/debtor-tranction/Model/refund';
import { ARServicesService } from 'src/app/Account Receivable/debtor-tranction/Services/arservices.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-refund-allocation',
  templateUrl: './refund-allocation.component.html',
  styleUrls: ['./refund-allocation.component.css']
})
export class RefundAllocationComponent implements OnInit {

  constructor(private aRServicesService:ARServicesService,private toastr: ToastrService) { }
 @Input() RefundMainID:any;
 @Input() RefundDetailID:any;
 @Input() DebtorID:any;
 @Output() OnCancel = new EventEmitter();
 SaveRefundAllocation:any[]=[];
 LBS_ACR_DebtorTransactions:any[]=[];
  ngOnInit() {
    this.GetRefundAllocation();
  }

  GetRefundAllocation(){
    this.LBS_ACR_DebtorTransactions=[];
   this.aRServicesService.getRefundallocation(this.DebtorID).subscribe((resp:any)=>{
    var sumallocatedamount=0;
    console.log(resp);
    resp.data.refund.forEach(element => {
      // element.allocatedAmountHome="1212";
      
      element.unAllocatedAmountHome=element.transactionAmountHome- element.allocatedAmountHome;
      //element.receiptDetailID=this.ReceptDetailIdToBind;
     // sumallocatedamount=sumallocatedamount+Number( element.allocateAmountToDisplay);
     
    });
    this.LBS_ACR_DebtorTransactions= resp.data.refund;
   })
  }
  closePopUp(){
    this.OnCancel.emit();
  }
  SaveAllocation(){
    console.log(this.LBS_ACR_DebtorTransactions);
    debugger;
    this.SaveRefundAllocation=[];
   var sum=0;
    this.LBS_ACR_DebtorTransactions.forEach(element => {
      let LBS_SOP_RefundsAllocations:any=new LBS_SOP_RefundsAllocation();
      debugger;
      LBS_SOP_RefundsAllocations.InvoiceID=element.sourceReference;  
      LBS_SOP_RefundsAllocations.RefundID=this.RefundDetailID;
      LBS_SOP_RefundsAllocations.AllocatedAmount=Number(element.amountToallocate);
      LBS_SOP_RefundsAllocations.RefundMainID=this.RefundMainID;
      sum=sum+Number(element.amountToallocate);
     
      this.SaveRefundAllocation.push(LBS_SOP_RefundsAllocations);
    });
    console.log( this.SaveRefundAllocation);
    this.aRServicesService.AddRRefundAllocation(this.SaveRefundAllocation).subscribe((resp: any) => {
      if(resp.isSuccess){
        this.toastr.success('Refund allocation update  successfully');
        this.closePopUp();
      }
     
       }, (error) => {
         console.error('Problem with the sevice. Please try later : ' + error);
       });
     
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DebtorService } from 'src/app/inv/services/debtor.service';
import { BsModalService, BsModalRef, CollapseModule } from 'ngx-bootstrap';
import { ARServicesService } from '../../../Services/arservices.service';
import { LBS_SOP_ReceiptsAllocation } from '../../../Model/receipt';
import { ToastrService } from 'ngx-toastr';
import { inputs } from '@syncfusion/ej2-angular-dropdowns/src/drop-down-list/dropdownlist.component';

@Component({
  selector: 'app-tranction-allocation',
  templateUrl: './tranction-allocation.component.html',
  styleUrls: ['./tranction-allocation.component.css']
})
export class TranctionAllocationComponent implements OnInit {
 

  constructor(private aRServicesService:ARServicesService
    ,private debtorservice: DebtorService,
    private toastr: ToastrService) { }
  modalRef: BsModalRef;
 @Input() AmountToDisplay :any;
 @Input()  AllocatedAmountToDisplay:any;
 @Input()  UnlocatedAmountToDisplay:any;
 @Input()  DebtorID:any;
 @Input() ReceiptMainID:any;
 @Input() ReceiptDetailID:any;
 @Output() OnCancel = new EventEmitter();
 Restictclick:boolean=false;
  DebtorTranctionData:any=[];
  ReceptDetailIdToBind:any;
  LBS_ACR_DebtorTransactions:any[]=[];
  SaveReceiptAllocation:any[]=[];
  index:any;
  DebtorByIdData: any;
  Disabledpupup:boolean=true;

  ngOnInit() {
    this.GetDebtorTranctionByID();
    console.log(this.ReceiptMainID);
  }
  GetDebtorTranctionByID(){
    this.LBS_ACR_DebtorTransactions=[];
    this.debtorservice.getDebtorTranctionByID(this.DebtorID).subscribe((resp: any) => {
  console.log(resp);
  var sumallocatedamount=0;
  resp.data.debtorTranctionbyId.forEach(element => {
    // element.allocatedAmountHome="1212";
    
    element.unAllocatedAmountHome=element.transactionAmountHome- element.allocateAmountToDisplay;
    element.receiptDetailID=this.ReceptDetailIdToBind;
    sumallocatedamount=sumallocatedamount+Number( element.allocateAmountToDisplay);
   
  });
  this.LBS_ACR_DebtorTransactions= resp.data.debtorTranctionbyId;
 
   this.AllocatedAmountToDisplay=sumallocatedamount;
   this.UnlocatedAmountToDisplay= this.AmountToDisplay-this.AllocatedAmountToDisplay;
  // this.AllocatedAmountToDisplay=0;
      // this.RowData.forEach(element => {
      //   element.allocatedAmountHome=element.unAllocatedAmountHome+ element.allocatedAmountHome;
      //   element.unAllocatedAmountHome=element.transactionAmountHome- element.allocatedAmountHome
      //  });
      // this.RowData = this.RowData;
      console.log(this.LBS_ACR_DebtorTransactions);
    }, (error) => {
      
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }

  closePopUp(){
    this.OnCancel.emit();
  }
  Cancel() {
    this.OnCancel.emit();
  }
  OnClickAlocateAmount(i)
{
  debugger;
  if(this.LBS_ACR_DebtorTransactions[i].unAllocatedAmountHome>this.AmountToDisplay)
  {
    this.LBS_ACR_DebtorTransactions[i].amountToallocate= this.UnlocatedAmountToDisplay;
    this.UnlocatedAmountToDisplay=0;
    this.AllocatedAmountToDisplay=this.AmountToDisplay-this.UnlocatedAmountToDisplay;
debugger;
  //     this.LBS_ACR_DebtorTransactions[i].unAllocatedAmountHome=this.LBS_ACR_DebtorTransactions[i].unAllocatedAmountHome-this.AmountToDisplay;
  // this.AllocatedAmountToDisplay=this.AmountToDisplay;
  // this.LBS_ACR_DebtorTransactions[i].amountToallocate=this.UnlocatedAmountToDisplay;
 if(this.AmountToDisplay==this.AllocatedAmountToDisplay)
 {
   this.Restictclick=true;
 }
  // this.UnlocatedAmountToDisplay=0;
  }
  else{
    this.LBS_ACR_DebtorTransactions[i].amountToallocate=this.LBS_ACR_DebtorTransactions[i].transactionAmountHome-this.LBS_ACR_DebtorTransactions[i].allocateAmountToDisplay;
    
    this.AllocatedAmountToDisplay=this.AllocatedAmountToDisplay+ this.LBS_ACR_DebtorTransactions[i].amountToallocate;
    this.UnlocatedAmountToDisplay=this.AmountToDisplay-this.AllocatedAmountToDisplay
    debugger;
    if(this.AmountToDisplay==this.AllocatedAmountToDisplay)
 {
   this.Restictclick=true;
 }
  }
  // this.LBS_ACR_DebtorTransactions[i].unAllocatedAmountHome=this.LBS_ACR_DebtorTransactions[i].unAllocatedAmountHome-this.AmountToDisplay;
  // this.AllocatedAmountToDisplay=this.AmountToDisplay;
  // this.LBS_ACR_DebtorTransactions[i].amountToallocate=this.UnlocatedAmountToDisplay;
 
  // this.UnlocatedAmountToDisplay=0;


}





SaveAllocation(){
  console.log(this.LBS_ACR_DebtorTransactions);
  debugger;
  this.SaveReceiptAllocation=[];
 var sum=0;
  this.LBS_ACR_DebtorTransactions.forEach(element => {
    let LBS_SOP_ReceiptsAllocations:any=new LBS_SOP_ReceiptsAllocation();
    debugger;
    LBS_SOP_ReceiptsAllocations.InvoiceID=element.sourceReference;  
    LBS_SOP_ReceiptsAllocations.ReceiptsID=this.ReceiptDetailID;
    LBS_SOP_ReceiptsAllocations.AllocatedAmount=Number(element.amountToallocate);
    LBS_SOP_ReceiptsAllocations.ReceiptsMainID=this.ReceiptMainID;
    sum=sum+Number(element.amountToallocate);
   
    this.SaveReceiptAllocation.push(LBS_SOP_ReceiptsAllocations);
  });
 
 // this.LBS_ACR_DebtorTransactions[this.index]=
 console.log(this.SaveReceiptAllocation)
 console.log( this.LBS_ACR_DebtorTransactions)
  this.aRServicesService.AddReceiptAllocation(this.SaveReceiptAllocation).subscribe((resp: any) => {
    if(resp.isSuccess){
      this.toastr.success('Receipt allocation update  successfully');
    }
   
     }, (error) => {
       console.error('Problem with the sevice. Please try later : ' + error);
     });
   
     
   this.closePopUp();
   this.GetDebtorTranctionByID();
}

debtorChange(event) {
  this.DebtorID = event.target.value;
  this.debtorservice.getDebtorByID(this.DebtorID).subscribe((resp: any) => {
  console.log(resp.data.debtorbyId);
  this.DebtorByIdData = resp.data.debtorbyId;
  }, (error) => {
  
  console.error('Problem with the sevice. Please try later : ' + error);
  });
  }
}

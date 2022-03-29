import { Component, OnInit, TemplateRef } from '@angular/core';
import { CustomValidators } from 'ngx-custom-validators';
import {ARServicesService} from 'src/app/Account Receivable/debtor-tranction/Services/arservices.service';
import { BsModalService, BsModalRef, CollapseModule } from 'ngx-bootstrap';
import { DebtorService } from 'src/app/inv/services/debtor.service';
import { TenderTypesService } from 'src/app/POS/services/tender-types.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LBS_SOP_ReceiptsAllocation, Receipt, ReceiptDetails } from '../Model/receipt';
import { ToastrService } from 'ngx-toastr';
import { SopOrderService } from 'src/app/POS/services/sop-order.service';
import { number } from 'ngx-custom-validators/src/app/number/validator';

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.css']
})
export class ReceiptsComponent implements OnInit {
  modalRef: BsModalRef;

  constructor(private aRServicesService:ARServicesService,
    private FB: FormBuilder,
    private tenderTypesService: TenderTypesService
    ,private debtorservice: DebtorService,
    private soporderService: SopOrderService,
    private toastr: ToastrService,
    private modalService: BsModalService) { }

    ReceiptForm: FormGroup;
  AgLoad: boolean = false;
  Mode:any='List';
  RowData: any[] = [];
  ColumnDefs:any;
  DebtorTranctionData:any=[];
  AllDebtores:any;
  TenderTypes:any;
  DebtorID:any;
  DebtorByIdData:any;
  CurrentShiftID:any;
  PaymentType:any;
  submitted: boolean;
  ReceiptMainID:any;
  Disabledpupup:boolean=true;
  AllocatedAmountToDisplay:any;
  AmountToDisplay:any;
  UnlocatedAmountToDisplay:any;
  ReceptDetailIdToBind:any;
  LBS_ACR_DebtorTransactions:any[]=[];
  SaveReceiptAllocation:any[]=[];
  PreviousTranction:any[]=[];
  IsCloseShift:boolean=false;
  Restictclick:boolean=false;
  index:any;
  ngOnInit() {
    this.AgLoad = false;
    this.ColumnDefs = [
      { headerName: 'Receipt Batch No', field: 'receiptBatchNo', sortable: true, filter: true, checkboxSelection: false, editable: false },
      { headerName: 'Status', field: 'status_Text', sortable: true, filter: true, checkboxSelection: false, editable: false },
      { headerName: '', field: 'Edit', type: 'EditAction', hide: false },
      { headerName: '', field: 'Delete', type: 'DeleteAction', hide: false }
    ];

   
    this.Mode='List';
    this.CreateForm();
    this.GetAllReceiptMain();
    this.GetCurrentshift();
    this.BindDebtor();
    this.GetTenderTypeList();
    // let ReceiptDetail:any =new ReceiptDetails()
    // this.DebtorTranctionData=ReceiptDetail;
    // console.log(this.DebtorTranctionData)
  }
  CreateForm(){
    this.ReceiptForm = this.FB.group({
      BatchNumber: ['', Validators.required] ,
      Description: [''],

    })
  }
GetAllReceiptMain(){
  this.AgLoad = false;
   this.RowData = [];
  this.aRServicesService.getAllReceipt().subscribe((resp: any) => {
    console.log(resp.data.Receipt);
    this.RowData=resp.data.receipt;
    this.AgLoad = true;
   //this.AllDebtores=resp.data.debtor;
  }, (error) => {
    
    console.error('Problem with the sevice. Please try later : ' + error);
  });


}
AddNew(){
  this.DebtorTranctionData=[];
  this.Mode='Add';
  this.submitted = false;
  this.ReserForm();
  this.ReceiptForm.enable();
  this.IsCloseShift=false;
  let ReceiptDetail:any =new ReceiptDetails()
  this.DebtorTranctionData.push(ReceiptDetail);
  console.log(this.DebtorTranctionData)
}
OnActionClick(event){
  var colId = event.column.getId();
  if (colId == 'Edit') {
    debugger;
    this.ReceiptMainID=event.data.id;
    this.GetReceptMainbyID(event.data.id);
    this.GetReceptDetailByID(event.data.id);
    this.Mode = 'Edit';
    // this.Edit(event.data.id);
  }
   // this.SelectedDebtorid = event.data.id;
  // } else if (colId == 'Delete') {
  //   debugger;
  //   this.onDeleteChecked(event.data.id)
  // }
}

CreateNewLineForPayment(){
  this.BindDebtor();
  debugger;
    this.GetTenderTypeList();
  
}

BindDebtor() {

  this.debtorservice.getDebtor().subscribe((resp: any) => {
  
   this.AllDebtores=resp.data.debtor;
  }, (error) => {
    
    console.error('Problem with the sevice. Please try later : ' + error);
  });
}
OnDebtorChange(event,i)
{
  debugger;
  this.DebtorID=event.target.value;
  this.DebtorTranctionData[i].debtor=event.target.value;
   this.debtorservice.getDebtorByID(this.DebtorID).subscribe((resp: any) => {
     console.log(resp.data.debtorbyId);
     this.DebtorByIdData=resp.data.debtorbyId;
     this.DebtorTranctionData[i].bankAccountNumber=this.DebtorByIdData.bankAccountNumber;
     
   }, (error) => {
     
     console.error('Problem with the sevice. Please try later : ' + error);
   });
   
}
GetTenderTypeList() {
debugger;
  this.tenderTypesService.GetTenderTypes().subscribe((res: any) => {
    this.TenderTypes = res.data.tenderTypes;
    console.log(this.TenderTypes);
    debugger
  }, (error) => {
   // this.toastr.error('Problem with the sevice. Please try later : ' + error);
  });
}
onSave(){

  let indexx = this.DebtorTranctionData.findIndex(c => c.debtorID == '-1');
  if (indexx >= 0) {
    this.toastr.warning('Please select debtor');
    return;
  }
  let Receipts: any = new Receipt();
  Receipts.ReceiptBatchNo=this.ReceiptForm.get('BatchNumber').value;
  Receipts.Description=this.ReceiptForm.get('Description').value;
  Receipts.CompanyID=localStorage.getItem('CompanyID');
  Receipts.Status=false;
  Receipts.TransactionSourceID=this.CurrentShiftID;
  Receipts.CreatedBY=localStorage.getItem('LoginID');

  console.log(this.ReceiptForm.get('BatchNumber').value);
  if(this.Mode=='Add')
  {
    this.aRServicesService.AddReceiptMain(Receipts).subscribe((resp: any) => {
      console.log(resp);
      debugger;
      if(resp.isSuccess)
      {
        this.ReceiptMainID=resp.data.receipt;
        let LineNo=0;
       // this.DebtorTranctionData[0].receiptMainID='90C95805-0133-41F4-B1C6-7A428AEA7DF7';
        this.DebtorTranctionData.forEach(element => {
          debugger;
          LineNo=LineNo+1;
          element.receiptMainID=resp.data.receipt;
          element.paymentLineNo=LineNo;
          element.shiftID=this.CurrentShiftID;
        });  
        this.SaveReceiptDetail();
      }
     
      
    
     }, (error) => {
       
       console.error('Problem with the sevice. Please try later : ' + error);
     });


  }
  if(this.Mode=='Edit')
{
 let LineNo=0;
this.DebtorTranctionData.forEach(element => {
debugger;
LineNo=LineNo+1;
element.receiptMainID=this.ReceiptMainID;
element.paymentLineNo=LineNo;
element.shiftID=this.CurrentShiftID;
});
this.SaveReceiptDetail();

}
  
}
SaveReceiptDetail(){
  debugger;
  this.aRServicesService.AddReceiptDetail(this.DebtorTranctionData).subscribe((resp: any) => {
  console.log(resp);
  if (resp.isSuccess) {
  this.toastr.success('Receipt Details added successfully');
  this.Mode='Edit';
  this.GetReceptMainbyID(this.ReceiptMainID);
  this.GetReceptDetailByID(this.ReceiptMainID);
  }
  else{
  this.toastr.warning("Receipt number is already exist");
  }
  }, (error) => {
  
  console.error('Problem with the sevice. Please try later : ' + error);
  });
  }
Deleteindex(i){
  this.DebtorTranctionData.splice(i, 1);
}
AddNewReceiptDetailLine(){

  let ReceiptDetail:any =new ReceiptDetails()
  this.DebtorTranctionData.push(ReceiptDetail);
  this.GetTenderTypeList();
}
GetCurrentshift()
{

  this.soporderService.GetShift(localStorage.getItem('CompanyID')).subscribe((resp: any) => {
 this.CurrentShiftID=resp.data.id;
//  this.CurrentShiftNo=resp.data.shiftNo;
 console.log(this.CurrentShiftID)
  }, (error) => {
    console.error('Problem with the sevice. Please try later : ' + error);
  });
}
GetReceptMainbyID(OrderMainID)
{
 this.aRServicesService.getReceiptMainByid(OrderMainID).subscribe((resp: any) => {
 console.log(resp.data.receipt)
 this.ReceiptForm.patchValue({
  BatchNumber:resp.data.receipt[0].receiptBatchNo,
  Description: resp.data.receipt[0].description,
 })
 if(resp.data.receipt[0].status){
   this.IsCloseShift=true;
   this.ReceiptForm.disable();

 }
 else{
  this.IsCloseShift=false;
  this.ReceiptForm.enable();
 }
  }, (error) => {
    console.error('Problem with the sevice. Please try later : ' + error);
  });
}
GetReceptDetailByID(OrderMainID)
{
 this.DebtorTranctionData=[];
  this.aRServicesService.getDetailbyid(OrderMainID).subscribe((resp: any) => {
 console.log(resp.data.receipt)
 this.DebtorTranctionData=resp.data.receipt;
 console.log(this.DebtorTranctionData);
  }, (error) => {
    console.error('Problem with the sevice. Please try later : ' + error);
  });
}
OnPaymentTypeChange(event)
{
this.PaymentType=event.target.value;
console.log(this.PaymentType);
}
ReserForm(){
  this.ReceiptForm.patchValue({
    BatchNumber:'',
    Description:''
  })
}
Back(){
  this.Mode='List';
  this.ReserForm();
  this.GetAllReceiptMain();
}
OpenDebtor(Debtor: TemplateRef<any>,id,homeAmount,allocatedAmount,DebtorID,i) {
  console.log(DebtorID);
  if(DebtorID=='-1' || DebtorID=="")
  {
    this.toastr.warning('Please select debtor');
    return;
  }
  this.AmountToDisplay=homeAmount;
 
  this.AllocatedAmountToDisplay=allocatedAmount;
  this.UnlocatedAmountToDisplay=homeAmount-allocatedAmount;
  this.GetDebtorTranctionByID(DebtorID);
  this.modalRef = this.modalService.show(Debtor);
  this.ReceptDetailIdToBind=id;
  this.index=i;
 this.Restictclick=false;
}
OpenPrevious(Previous: TemplateRef<any>,id,homeAmount,DebtorID,i){
  this.modalRef = this.modalService.show(Previous);
  this.Getprevioustranction(id);
}
Getprevioustranction(id)
{
  this.aRServicesService.getprevioustranction(id).subscribe((resp: any) => {
 //this.CurrentShiftID=resp.data.id;
//  this.CurrentShiftNo=resp.data.shiftNo;
this.PreviousTranction=resp.data.receipt;
console.log(resp.data.receipt)
 console.log(resp)
  }, (error) => {
    console.error('Problem with the sevice. Please try later : ' + error);
  });
}
closePrevious(){
  this.modalRef.hide();
}
closePopUp(){
  this.modalRef.hide();
}
GetDebtorTranctionByID(DebtorID){
  this.LBS_ACR_DebtorTransactions=[];
  this.debtorservice.getDebtorTranctionByID(DebtorID).subscribe((resp: any) => {
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

  }, (error) => {
    
    console.error('Problem with the sevice. Please try later : ' + error);
  });
}
OnClickAlocateAmount(i)
{
 
  if(this.LBS_ACR_DebtorTransactions[i].unAllocatedAmountHome>this.AmountToDisplay)
  {
    // this.LBS_ACR_DebtorTransactions[i].amountToallocate= this.UnlocatedAmountToDisplay;
    // this.UnlocatedAmountToDisplay=0;
    // this.AllocatedAmountToDisplay=this.AmountToDisplay-this.UnlocatedAmountToDisplay;

  //     this.LBS_ACR_DebtorTransactions[i].unAllocatedAmountHome=this.LBS_ACR_DebtorTransactions[i].unAllocatedAmountHome-this.AmountToDisplay;
  // this.AllocatedAmountToDisplay=this.AmountToDisplay;
  // this.LBS_ACR_DebtorTransactions[i].amountToallocate=this.UnlocatedAmountToDisplay;
 if(this.AmountToDisplay==this.AllocatedAmountToDisplay)
 {
  // this.Restictclick=true;
 }
  // this.UnlocatedAmountToDisplay=0;
  }
  else{
    // this.LBS_ACR_DebtorTransactions[i].amountToallocate= this.UnlocatedAmountToDisplay;
    // this.UnlocatedAmountToDisplay=0;
    // this.AllocatedAmountToDisplay=this.AmountToDisplay-this.UnlocatedAmountToDisplay;

    // this.LBS_ACR_DebtorTransactions[i].amountToallocate=this.UnlocatedAmountToDisplay-Number(this.LBS_ACR_DebtorTransactions[i].unAllocatedAmountHome);
    
    // this.AllocatedAmountToDisplay=this.AllocatedAmountToDisplay+ this.LBS_ACR_DebtorTransactions[i].amountToallocate;
    // this.UnlocatedAmountToDisplay=this.AmountToDisplay-this.AllocatedAmountToDisplay
 
    if(this.AmountToDisplay==this.AllocatedAmountToDisplay)
 {
   //this.Restictclick=true;
 }
  }
  // this.LBS_ACR_DebtorTransactions[i].unAllocatedAmountHome=this.LBS_ACR_DebtorTransactions[i].unAllocatedAmountHome-this.AmountToDisplay;
  // this.AllocatedAmountToDisplay=this.AmountToDisplay;
  // this.LBS_ACR_DebtorTransactions[i].amountToallocate=this.UnlocatedAmountToDisplay;
 
  // this.UnlocatedAmountToDisplay=0;
  if(Number(this.LBS_ACR_DebtorTransactions[i].unAllocatedAmountHome)!=0)
  {
    debugger;
    if(this.LBS_ACR_DebtorTransactions[i].unAllocatedAmountHome>this.UnlocatedAmountToDisplay)
    {
     this.LBS_ACR_DebtorTransactions[i].amountToallocate= this.UnlocatedAmountToDisplay;
    this.UnlocatedAmountToDisplay=0;
    this.AllocatedAmountToDisplay=this.AmountToDisplay-this.UnlocatedAmountToDisplay;
    }
    else{
      this.LBS_ACR_DebtorTransactions[i].amountToallocate=Number(this.LBS_ACR_DebtorTransactions[i].unAllocatedAmountHome);
    
      this.AllocatedAmountToDisplay=this.AllocatedAmountToDisplay+ this.LBS_ACR_DebtorTransactions[i].amountToallocate;
      this.UnlocatedAmountToDisplay=this.AmountToDisplay-this.AllocatedAmountToDisplay
    }
    // this.LBS_ACR_DebtorTransactions[i].amountToallocate= this.UnlocatedAmountToDisplay;
    // this.UnlocatedAmountToDisplay=0;
    // this.AllocatedAmountToDisplay=this.AmountToDisplay-this.UnlocatedAmountToDisplay;
debugger;
  }
  else{

  }

}
AddReceiptAllocation
SaveAllocation(){
  console.log(this.LBS_ACR_DebtorTransactions);
  debugger;
  this.SaveReceiptAllocation=[];
 var sum=0;
  this.LBS_ACR_DebtorTransactions.forEach(element => {
    let LBS_SOP_ReceiptsAllocations:any=new LBS_SOP_ReceiptsAllocation();
    debugger;
    LBS_SOP_ReceiptsAllocations.InvoiceID=element.sourceReference;  
    LBS_SOP_ReceiptsAllocations.ReceiptsID=element.receiptDetailID;
    LBS_SOP_ReceiptsAllocations.AllocatedAmount=Number(element.amountToallocate);
    LBS_SOP_ReceiptsAllocations.ReceiptsMainID=this.ReceiptMainID;
    sum=sum+Number(element.amountToallocate);
   
    this.SaveReceiptAllocation.push(LBS_SOP_ReceiptsAllocations);
  });
  //this.DebtorTranctionData[this.index].allocatedAmount=sum;
  //this.LBS_ACR_DebtorTransactions[this.index].allocatedAmount=sum;
 console.log(this.SaveReceiptAllocation)
 console.log( this.LBS_ACR_DebtorTransactions)
  this.aRServicesService.AddReceiptAllocation(this.SaveReceiptAllocation).subscribe((resp: any) => {
    if(resp.isSuccess){
      this.toastr.success('Receipt allocation update  successfully');
    }
   
     }, (error) => {
       console.error('Problem with the sevice. Please try later : ' + error);
     });
    // this.SaveReceiptDetail();
    this.GetReceptDetailByID(this.ReceiptMainID);
     
   this.closePopUp();
}
CloseReceiptReceipt(){
 console.log(this.ReceiptMainID); 
 let Receipts: any = new Receipt();
  Receipts.ID=this.ReceiptMainID;
  Receipts.Description=this.ReceiptForm.get('Description').value;
  Receipts.CompanyID=localStorage.getItem('CompanyID');
  Receipts.Status=true;
  Receipts.TransactionSourceID=this.CurrentShiftID;
  Receipts.CreatedBY=localStorage.getItem('LoginID');
  this.aRServicesService.UpdateReceptMain(Receipts).subscribe((resp: any) => {
    console.log(resp);
    debugger;
    if(resp.isSuccess)
    {
      this.ReceiptMainID=resp.data.receipt;
      this.toastr.success('Receipt Close successfully');
      this.GetReceptMainbyID(this.ReceiptMainID);

    }
    
    
  
   }, (error) => {
     
     console.error('Problem with the sevice. Please try later : ' + error);
   });

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

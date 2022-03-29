import { Input, TemplateRef, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef, CollapseModule } from 'ngx-bootstrap';
import { DebtorService } from 'src/app/inv/services/debtor.service';
import { TenderTypesService } from 'src/app/POS/services/tender-types.service';
import { ConfirmationDialogPopupComponent } from 'src/app/shared/shared-components/confirmation-dialog-popup/confirmation-dialog-popup.component';


@Component({
  selector: 'app-debtor-credit-payment',
  templateUrl: './debtor-credit-payment.component.html',
  styleUrls: ['./debtor-credit-payment.component.css']
})
export class DebtorCreditPaymentComponent implements OnInit {
  ReceiptMainID: any;
  ReceiptDetailID: any;

  @ViewChild('confirmation') confirmation: ConfirmationDialogPopupComponent;
  constructor(private modalService: BsModalService,
    private tenderTypesService: TenderTypesService
    ,private debtorservice: DebtorService) { }
  modalRef: BsModalRef;
  DebtorTranctionData:any=[];
  DebtorCreditTranctionData:any[]=[];
  AllDebtores:any;
  TenderTypes:any;
  @Input() DebtorID:any;
  AmountToDisplay :any;
  AllocatedAmountToDisplay:any;
  UnlocatedAmountToDisplay:any;
  DebtorByIdData:any;
  ngOnInit() {
    console.log(this.DebtorID)
   this.BindDebtor();
  }
  // addnew() {
  
  //   let object = {
  //     'date':new Date(),
  //     'dueDate':new Date(),
  //     'debtor': "POS",
  //     'homeAmount': 0,
  //     'fXCurrency': 0,
  //     'homeAllocated': 0,
  //     'fXAllocated': 0,
  //     'paymentType':"",
  //     'bankAccountNumber':""
  //   }
  //   this.DebtorTranctionData.push(object);

  // }

  
  BindDebtor() {

    this.debtorservice.GetDebtorCreditTranctionByID(this.DebtorID).subscribe((resp: any) => {
      resp.data.debtorTranctionbyId.forEach(element => {
        // element.allocatedAmountHome="1212";
        element.unAllocatedAmountHome=element.transactionAmountHome- element.allocatedAmountHome
      });
      this.DebtorCreditTranctionData=resp.data.debtorTranctionbyId;
    //  resp.data.debtorTranctionbyId.forEach(element => {
    //    element.availableAmount=element.homeAmount-element.allocatedAmount;
    //  });
    //  this.DebtorCreditTranctionData=resp.data.debtorTranctionbyId;
    console.log(this.DebtorCreditTranctionData)
    }, (error) => {
      
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  OnDebtorChange(event,i)
  {
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

    this.tenderTypesService.GetTenderTypes().subscribe((res: any) => {
      this.TenderTypes = res.data.tenderTypes;
    }, (error) => {
     // this.toastr.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  onSave(){
    console.log(this.DebtorTranctionData)
  }
  Deleteindex(i){
    this.DebtorTranctionData.splice(i, 1);
  }

  OpenDebtor(Debtor: TemplateRef<any>,homeAmount,allocatedAmount,availableAmount,id,receiptMainID,i) {
    this.modalRef = this.modalService.show(Debtor);
  
    this.AmountToDisplay=homeAmount;
   
    this.AllocatedAmountToDisplay=allocatedAmount;
    this.UnlocatedAmountToDisplay=homeAmount-allocatedAmount;
    this.ReceiptMainID=receiptMainID; 
    this.ReceiptDetailID=id;
    
   
   // this.GetDebtorTranctionByID(DebtorID);
  }
  closePopUp(){
    debugger;
    this.modalRef.hide();
    this.BindDebtor();

  }
  OpenPrevious(Previous: TemplateRef<any>,id,i){
    this.modalRef = this.modalService.show(Previous);
    this.ReceiptDetailID=id;
  }

  AutomaticAllocation(){
    this.confirmation.ConfirmationPopup('Are you sure, Do you want Automatically Allocate All Credit to Invoice ?');
  }
  OnAccept($event){
   console.log("Okay");
  
}


}

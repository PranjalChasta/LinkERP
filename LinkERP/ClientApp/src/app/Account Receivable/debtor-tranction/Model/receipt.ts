export class Receipt {
    ID:any;
    CompanyID:any;
    ReceiptBatchNo:any;
    Description:any;
    Status:any;
    TransactionSourceID:any;
    GroupPayments:any;
    CreatedBY:any;
    WarehouseID:any;
}
export class ReceiptDetails
{
       id :any='00000000-0000-0000-0000-000000000000';
       companyID :any=localStorage.getItem('CompanyID');
       receiptMainID  :any='00000000-0000-0000-0000-000000000000';
       receiptNumber :any='';
        paymentLineNo :any='';
        paymentDate :any=new Date();
        debtorID :any='-1';
        shiftID :any='';
        description:any='';
        paymentType:any='-1';
        homeAmount :any=0;
         currency:any='-1';
        exchangeRate :any=0;
         foreignAmount :any=0;
         customerPaidAmount :any=0;
         customerChangeGiven :any=0;
         allocatedAmount :any=0;
         availableAmount :any=0;
        shiftReconciled :any=true;
         bankReconciled:any=true;
        transactionSourceReference:any='';
        paymentDetail1 :any='';
         paymentDetail2 :any='';
         paymentDetail3:any='';
       paymentDetail4 :any='';
        paymentDetail5 :any='';
         paymentDetail6:any='';
         paymentDetail7 :any='';
         paymentDetail8 :any='';
         createdBY :any=localStorage.getItem('LoginID');;
         deleted :any=0;
          wareHouseID:any='00000000-0000-0000-0000-000000000000';
}
export class LBS_SOP_ReceiptsAllocation {
  ID:any;
  CompanyID:any=localStorage.getItem('CompanyID');;
  InvoiceID:any;
  ReceiptsID:any;
  AllocatedAmount:any;
  ReceiptsMainID:any;
  CreatedBY:any=localStorage.getItem('LoginID');
  WarehouseID:any;
}
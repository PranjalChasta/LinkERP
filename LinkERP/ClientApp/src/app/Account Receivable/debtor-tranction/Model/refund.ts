
export class RefundMain {
    ID:any;
    CompanyID:any=localStorage.getItem('CompanyID');;
    RefundBatchNo:any='';
    Description:any='';
    Status:any;
    TransactionSourceID:any;
    GroupPayments:any;
    CreatedBY:any=localStorage.getItem('LoginID');;
    WarehouseID:any;
}
export class lBS_SOP_RefundDetail
{
       id :any='00000000-0000-0000-0000-000000000000';
       companyID :any=localStorage.getItem('CompanyID');
       refundMainID  :any='00000000-0000-0000-0000-000000000000';
       refundNumber :any;
       refundLineNo :any;
       refundDate :any=new Date();
        debtorID :any='00000000-0000-0000-0000-000000000000'
        shiftID :any;
        description:any;
        paymentType:any='00000000-0000-0000-0000-000000000000';
        homeRefundAmount :any='0';
         currency:any;
        exchangeRate :any;
         foreignRefundAmount :any;
        shiftReconciled :any;
         bankReconciled:any;
        transactionSourceReference:any;
        paymentDetail1 :any;
         paymentDetail2 :any;
         paymentDetail3:any;
       paymentDetail4 :any;
        paymentDetail5 :any;
         paymentDetail6:any;
         paymentDetail7 :any;
         paymentDetail8 :any;
         createdBY :any=localStorage.getItem('LoginID');;
         deleted :any;
          wareHouseID:any;
}

export class RefundMainRefundDetail{
    lBS_SOP_RefundMain: RefundMain; 
    lBS_SOP_RefundDetail:Array<lBS_SOP_RefundDetail> = []; 
}

export class LBS_SOP_RefundsAllocation {
    ID:any;
    CompanyID:any=localStorage.getItem('CompanyID');
    InvoiceID:any;
    RefundID:any;
    AllocatedAmount:any;
    RefundMainID:any;
    CreatedBY:any=localStorage.getItem('LoginID');
    WarehouseID:any;
  }
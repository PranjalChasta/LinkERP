import { BaseEntity } from "../base-entity";
export class LBS_SOP_ReceiptsDetail extends BaseEntity {
     ReceiptMainID :any= '00000000-0000-0000-0000-000000000000';
     CompanyID :any=localStorage.getItem('CompanyID');
     ReceiptNumber : any;
     PaymentLineNo : any;
      PaymentDate :any= new Date();
     ShiftID :any= '00000000-0000-0000-0000-000000000000';
     Description: any;
     PaymentType: any;
     HomeAmount: any;
     Currency: any= '00000000-0000-0000-0000-000000000000';
     ExchangeRate: any;
     ForeignAmount: any;
     CustomerPaidAmount: any;
     CustomerChangeGiven: any;
     AllocatedAmount: any;
     AvailableAmount: any;
     ShiftReconciled: any;
     BankReconciled: any;
     TransactionSourceReference: any;
     PaymentDetail1: any;
     PaymentDetail2: any;
     PaymentDetail3: any;
     PaymentDetail4: any;
     PaymentDetail5: any;
     PaymentDetail6: any;
     PaymentDetail7: any;
     PaymentDetail8: any;
     CreatedBY: any;
     Deleted: any;
     DeletedBy: any;
    WareHouseID: any;
     Discount: any;
     LineNum: any;
    DebtorID: any;
}
export class LBS_SOP_ReceiptsMain extends BaseEntity {
    ID:any='00000000-0000-0000-0000-000000000000';
    CompanyID :any=localStorage.getItem('CompanyID');
    WareHouseID: any;
    ReceiptBatchNo :any
    ReceiptBatchDate :any=new Date();
    Description :any
    Status :any=false
    TransactionSourceID :any
    GroupPayments :any
    CreatedBY:any=localStorage.getItem('LoginID')
}
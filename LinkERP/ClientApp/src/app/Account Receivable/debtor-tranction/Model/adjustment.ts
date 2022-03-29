export class Adjustment {
    ID:any='00000000-0000-0000-0000-000000000000';
    CompanyID:any=localStorage.getItem('CompanyID');
    BatchNo:any
    Status:any
    BatchDate:any=new Date();
    Description:any
    Status_Text:any;
    CreatedBY:any=localStorage.getItem('LoginID');
}
export class AdjustmentDetail {
    iD:any='00000000-0000-0000-0000-000000000000';
    companyID :any=localStorage.getItem('CompanyID');
    dBAdjustmentMainID:any='00000000-0000-0000-0000-000000000000';
    adjustmentReferenceNo:any;
    lineNoo:any
    adjustmentDate:any=new Date();
    debtorID:any='00000000-0000-0000-0000-000000000000'
    writeOnOff:boolean=true;
    transactionAmount:any='0.0000';
    taxID:any='00000000-0000-0000-0000-000000000000'
    taxRate:any='0.0000';
    taxAmount:any='0.0000';
    reason:any
    adjustmentGL:any
    dateCreated:any
    createdBY:any=localStorage.getItem('LoginID')
}
export class AddUpdateAdjustment{
    lBS_SOP_Adjustment: Adjustment; 
    
    lBS_SOP_AdjustmentDetail:Array<AdjustmentDetail> = []; 
}

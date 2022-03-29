import { BaseEntity } from "../base-entity";

export class LbsQuoteAnalysis extends BaseEntity{
    public companyID:any
    public requisitionDetailID:any
    public lineNo:number
    public vendorID:any 
    public productID :any
    public productDescription:string 
    public UOM:string 
    public unitPrice:number
    public preferredVendor:boolean
}
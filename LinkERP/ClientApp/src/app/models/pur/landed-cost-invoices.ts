import { BaseEntity } from "../base-entity";

export class LandedCostInvoices extends BaseEntity{
    CompanyID
    PurchaseLandedCostID
    VendorLedgerID
    VendorID
    CurrencyID
    InvoiceNo
    FXRate
    ExpectedHomeAmount
    ExpectedFXAmount
    BookedInFXAmount 
    BookedInHomeAmount
    VendorInvoiceID
    Invoiced
    DueDate
    InvoiceDate 
    TaxAmount
    HomeAmountIncTax
}

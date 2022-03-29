import { BaseEntity } from "../base-entity";

export class LandedCostTaxableImports extends BaseEntity {
    CompanyID
    PurchaseLandedCostID
    VendorID
    VendorLedgerID
    TaxID
    TaxLedgerID
    ImportCostDescription
    InvoiceNo
    Amount
    TaxAmount
    DueDate
    Invoiced
    VendorInvoiceID
    InvoiceDate
}

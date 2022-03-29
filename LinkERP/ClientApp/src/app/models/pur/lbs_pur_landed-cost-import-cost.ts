import { BaseEntity } from "../base-entity";

export class LandedCostImportCost extends BaseEntity {
    CompanyID
    PurchaseLandedCostID
    VendorID
    CurrencyID
    CurrencyName
    VendorLedgerID
    TaxID
    TaxLedgerID
    InvoiceNo
    FXRate
    LineTotalTaxAmount
    LineTotalForeignExchangeCostTaxInclusive
    TotalExcludingTaxHome
    TotalLineTaxAmountHome
    LineTotalHomeAmountTaxInclusive
    VendorInvoiceID
    VendorAccountName
    Apportion
    ApportionMethod
    CostLedgerID
    CostDescription
    Amount
    TaxAmount
    DueDate
    Invoiced
    InvoiceDate

}

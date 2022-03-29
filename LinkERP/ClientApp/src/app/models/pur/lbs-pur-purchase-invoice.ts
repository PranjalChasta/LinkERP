import { BaseEntity } from "../base-entity"
export class LBSPURPurchaseInvoice extends BaseEntity {
  CompanyID: any;
  InvoiceNo: any;
  VendorID: any;
  InvoiceDate: any;
  DueDate: any;
  Status: boolean;
  Reversed:boolean;
  Freight: any;
  FreightTaxID: any;
  FreightTaxRate: any;
  FreightTaxAmount: any;
  Duty: any;
  DutyTaxID: any;
  DutyTaxRate: any;
  DutyTaxAmount: any;
  Insurance: any;
  InsuranceTaxID: any;
  InsuranceTaxRate: any;
  InsuranceTaxAmount: any;
  TotalExcludingTaxHome: any;
  TotalTaxHome: any;
  InvoiceToleranceAmount: any;
  InvoicedHomeAmount:any;
  TotalIncludingTaxHome: any;
  CurrencyID: any;
}


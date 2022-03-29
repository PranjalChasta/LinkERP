import { BaseEntity } from "../base-entity";

export class LBSPURPurchaseGoodsReceiveNote extends BaseEntity {
    CompanyID: any;
    WareHouseID: any;
    GRNNo: any;
    SupplierDeliveryReference: any;
    VendorID: any;
    ReceivedDate: any;
    Status: any;
    Reversed: any;
    Invoiced: any;
    PurchaseInvoiceID: any;
    Insurance: any;
    InsuranceTaxID: any;
    InsuranceTaxRate: any;
    InsuranceTaxAmount: any;
    Freight: any;
    FreightTaxID: any;
    FreightTaxRate: any;
    FreightTaxAmount: any;
    Duty: any;
    DutyTaxID: any;
    DutyTaxRate: any;
    DutyTaxAmount: any;
    TotalExclusiveofTax: any;
    TaxTotal: any;
    TotalInclusiveofTax: any;
}

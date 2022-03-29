import { BaseEntity } from "../base-entity";

export class LbsPurPurchaseOrder extends BaseEntity{
    CompanyID: any;
    ID: any;
    VendorID
    WarehouseID
    ShiptoWarehouse
    PurchaseOrderWorkflow
    PurchaseOrderNumber
    OrderedDate
    ExpectedDeliveryDate
    Status
    PurchaseOrderValidityDays
    VendorWareHouseID
    Description
    AttentionPhone
    Attentionto
    Freight
    Duty
    Insurance
    FreightTaxID
    FreightTaxRate
    FreightTaxAmount
    DutyTaxID
    DutyTaxRate
    DutyTaxAmount
    InsuranceTaxID
    POTotalTax
    InsuranceTaxRate
    InsuranceTaxAmount
    POTaxInclusiveTotal
    POTaxExclusiveTotal
    FreightTaxInclusive
    DutyTaxInclusive
    InsuranceTaxInclusive
}
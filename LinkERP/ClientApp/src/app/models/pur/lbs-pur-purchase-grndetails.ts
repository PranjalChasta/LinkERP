import { BaseEntity } from "../base-entity";
import { LBSPURPurchaseGoodsReceiveNote } from "./lbs-pur-purchase-goods-receive-note";

export class LBSPURPurchaseGRNDetails extends BaseEntity {
    CompanyID: any;
    GRNID: any;
    PurchaseOrderID: any;
    PurchaseOrderLineID: any;
    PurchaseLineStatus: any;
    ProductType: any;
    ProductID: any;
    ProductDescription: any;
    ReceivedQuantity: any;
    UnitOfMeasure: any;
    SuppliersUnitCost: any;
    DiscountType: any;
    DiscountAmount: any;
    DiscountedUnitCost: any;
    LineTotalCostTaxEclusive: any;
    TaxID: any;
    TaxRate: any;
    LineTotalTaxAmount: any;
    LineTotalCostTaxInclusive: any;
    CurrencyID: any;
    FXRate: any;
    ForeignExchangeUnitCost: any;
    LineTotalForeignExchangeCostTaxExclusive: any;
    LineTotalForeignExchangeCostTaxInclusive: any;
    LineTotalHomeAmount: any;
    LineTotalForeignAmount: any;
    SupplierSKU: any;
    ClassificationID: any;
}

export class PurchaseGoodsReceiveNote{
    LBS_PUR_PurchaseGoodsReceiveNote: LBSPURPurchaseGoodsReceiveNote; 
    LBS_PUR_PurchaseGRNDetails:Array<LBSPURPurchaseGRNDetails> = []; 
}
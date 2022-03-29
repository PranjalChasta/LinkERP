import { BaseEntity } from "../base-entity";

export class LBSINVInventoryDebtorPrice extends BaseEntity {
    CompanyID:any;
    ProductID:any;
    CustomerID:any; 
    EnablCostPlusMarkup:any;
    MarkupPercentage:any;
    PromotionType:any;
    PromotionDays:any;
    PromotionDateFrom:any;
    PromotionDateTo:any;
    PromotionTimeFrom:any;
    PromotionTimeTo:any;
    PromotionalPrice:any;
    PromotionQuantityLimit:any;
    PromotionQuantitySold:any;
    PriceChangeReason:any='00000000-0000-0000-0000-000000000000';
    QuantityBreak1:any;
    QuantityBreak2:any;
    QuantityBreak3:any;
    QuantityBreak4:any;
    QuantityBreak5:any;
    PriceBreak1:any;
    PriceBreak2:any;
    PriceBreak3:any;
    PriceBreak4:any;
    PriceBreak5:any;
    CustomerCode:any;
    QuantityLimit_text :any;
    QuantitySold_text:any;

}

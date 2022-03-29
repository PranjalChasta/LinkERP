import { BaseEntity } from "../base-entity";

export class CommonProductPrice extends BaseEntity {
   /*  CompanyID:any;
    ProductID:any; */
    
    PriceLevel1:any;
    PriceLevel2:any;
    PriceLevel3:any;
    PriceLevel4:any;
    PriceLevel5:any;
    PriceLevel6:any;
    PriceLevel7:any;
    PriceLevel8:any;
    PriceLevel9:any;
    PriceLevel10:any;
    EnablCostPlusMarkup:any;
    PriceChangeReason:any='00000000-0000-0000-0000-000000000000';
    MarkupPercentage:any;
    PromotionType:any;
    PromotionDays:any;
    PromotionQuantityLimit:any;
    PromotionQuantitySold:any;
    PromotionDateFrom:any;
    PromotionDateTo:any;
    PromotionTimeFrom:any;
    PromotionTimeTo:any;
    PromotionalPrice:any;
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
}

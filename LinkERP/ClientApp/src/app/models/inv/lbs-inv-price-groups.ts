import { BaseEntity } from "../base-entity";

export class LBSINVPriceGroups extends BaseEntity {
    CompanyID:any;
    PriceClassCode:any;
    PriceClassName:any;
    TaxCodeID:any;
    PromotionType:any;
    PromotionDays:any;
    PromotionDateFrom:any;
    PromotionDateTo:any;
    PromotionTimeFrom:any;
    PromotionTimeTo:any;
    PromotionalPrice:any;
    PriceChangeReason:any='00000000-0000-0000-0000-000000000000';
    Quantity1:any;
    Quantity2:any;
    Quantity3:any;
    Quantity4:any;
    Quantity5:any;
    Price1:any;
    Price2:any;
    Price3:any;
    Price4:any;
    Price5:any;
}

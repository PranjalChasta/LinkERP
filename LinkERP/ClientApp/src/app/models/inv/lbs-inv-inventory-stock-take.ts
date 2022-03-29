import { BaseEntity } from "../base-entity";

export class LBSINVInventoryStockTake  extends BaseEntity {
    CompanyID :any;
    StockTakeNo :any;
    WareHouseID :any;
    CycleID :any;
    ProductIDStart :any;
    ProductIDEnd :any;
    CategoryIDStart :any;
    CategoryIDEnd :any;
    SubCategoryIDStart :any;
    SubCategoryIDEnd :any;
    BinIDStart :any;
    BinIDEnd :any;
    StockTakeStatus :any; 
    Cyclename:any;
}

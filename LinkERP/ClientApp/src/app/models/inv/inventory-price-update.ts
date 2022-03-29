import { BaseEntity } from "../base-entity"

export class InventoryPriceUpdate  extends BaseEntity{
    ID:any="00000000-0000-0000-0000-000000000000";
    CompanyID:any;
    PriceUpdateSchedulerNumber:any;
    ProductIDFrom:any;
    ProductIDTo:any;
    CategoryIDFrom:any;
    CategoryIDTo:any;
    SubCategoryIDFrom:any;
    SubCategoryIDTo:any;
    WareHouseIDFrom:any;
    WareHouseIDTo:any;
    SupplierIDFrom:any;
    SupplierIDTo:any;
    PriceChangeLevel:any;
    PricetoChange:any;
    UseExistingWareHousePrice:any;
    PriceFromWareHouse?:any;
    IncreaseDecrease:any;
    PercentValue:any;
    Amount:any;
    Status:any;
    CreatedBY:any=localStorage.getItem('LoginID');
   
    
   
    
    

} 

import { BaseEntity } from "../base-entity";
import { LbsInvWarehouse } from "./lbs-inv-warehouse";

export class LbsInvWarehouseNextNumbers extends BaseEntity {
    CompanyID:any;
    WarehouseID:any;
    Description:any;
    NextNumberPrefix:any;
    NextNumber:any;
    Name:any;
    Warehouse: any = new LbsInvWarehouse();
}

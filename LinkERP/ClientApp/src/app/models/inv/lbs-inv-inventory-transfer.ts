import { BaseEntity } from "../base-entity";

export class LBSINVInventoryTransfer extends BaseEntity{
    CompanyID
    TransferNo
    WareHouseFrom
    WareHouseTo
    TransferReason
    DateShipped
    ShippedBy
    DateReceived
    ReceivedBy
    Status
    CloseComment
}

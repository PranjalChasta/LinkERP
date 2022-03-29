import { BaseEntity } from "../base-entity";

export class LbsInvInventoryTransferDetail extends BaseEntity{
    CompanyID
    TransferID
    LineNumber
    ProductID
    UOM
    Cost
    RequestedQty
    ShippedQty
    ReceivedQty
}

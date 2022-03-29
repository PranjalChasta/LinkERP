import { BaseEntity } from "../base-entity";

export class LbsPurLandedCostShipmentBookingDetail extends BaseEntity {
    CompanyID
    ShipmentBookingID
    ShipmentLineID
    ProductType
    ProductID
    ProductCode
    Description
    UseSerialNo
    UseExpiry
    Weight
    Volume
    QuantityOrdered
    QuantityReceived
    QuantityOutstanding
    QuantitytoReceive
    LandedUnitCostTaxExclusiveHome
}

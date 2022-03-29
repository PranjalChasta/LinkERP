import { BaseEntity } from "../base-entity";

export class LBSINVInventoryStockAllocationDetails extends BaseEntity {
    CompanyID: any;
    ProductID: any;
    WarehouseID: any;
    BinID: any;
    ProductMatrixRow :any;
    ProductMatrixColumn :any;
    SerialNo :any;
    TransactionDateIn :any;
    ExpiryDate :any;
    Quantity :any;
    CostIn :any;
    SourceReference :any;
}

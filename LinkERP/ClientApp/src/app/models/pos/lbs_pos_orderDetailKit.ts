import { BaseEntity } from "../base-entity";

export class LbsSopOrderDetailKit extends BaseEntity {
    public CompanyID: any
    public SalesOrderMainID: any
    public OrderDetailLineNum: any
    public InventoryType: any
    public KITID: any
    public ParentID: any
    public UnitPrice:any
    public UnitCost:any
    public SalesQuantity: any
    public ReturnsQuantity: any
    public ConversionRatio: any
}
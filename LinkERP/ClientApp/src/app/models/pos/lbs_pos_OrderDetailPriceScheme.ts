import { BaseEntity } from "../base-entity";

export class LbsSopOrderDetailPriceScheme extends BaseEntity {
    public CompanyID: any
    public SalesOrderDetailID: any
    public OrderDetailLineNum: any
    public InventoryType: any
    public ProductID: any
    public PriceGroupID: any
    public UnitPrice: any
    public SalesQuantity: any
    public ReturnsQuantity: any

}
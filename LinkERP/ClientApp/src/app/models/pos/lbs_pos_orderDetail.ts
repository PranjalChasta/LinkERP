import { BaseEntity } from "../base-entity";

export class LbsSopOrderDetail extends BaseEntity {
    public CompanyID: any
    public SalesOrderMainID: any
    public LineNum: any
    public InventoryType: any
    public ProductID: any
    public Description: any
    public ProductWeight: any
    public ProductCubic: any
    public Places: any
    public InventoryGLClassification: any
    public InventoryCost: any
    public TransactionQuantity: any
    public UOM: any
    public UnitPrice: any
    public DiscountType: any
    public DiscountAmount: any
    public TaxID: any
    public TaxRate: any
    public TaxLabel: any
    public LineTotalTaxAmount: any
    public LineTotalIncludingTax: any
    public WarrantyPeriod: any
    public WarrantyNotes: any
}
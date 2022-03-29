import { BaseEntity } from "../base-entity";

export class LbsPosQuotationDetail extends BaseEntity {
    public CompanyID
    public QuotationMainID
    public LineNum
    public InventoryType
    public ProductID
    public Description
    public ProductWeight
    public ProductCubic
    public DecimalPlaces
    public InventoryGLClassification
    public InventoryCost
    public TransactionQuantity
    public UOM
    public UnitPrice
    public DiscountType
    public DiscountAmount
    public TaxID
    public TaxRate
    public TaxLabel
    public LineTotalExcludingTax
    public LineTotalTaxAmount
    public LineTotalIncludingTax
}
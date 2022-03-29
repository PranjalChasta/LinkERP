using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR.PurchaseGoodsReceiveNote.PurchaseGRNDetail
{
    public class LBS_PUR_PurchaseGRNDetails:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid GRNID { get; set; }
        public Guid PurchaseOrderID { get; set; }
        public Guid? PurchaseOrderLineID { get; set; }
        public string PurchaseLineStatus { get; set; }
        public string ProductType { get; set; }
        public Guid? ProductID { get; set; }
        public string ProductDescription { get; set; }
        public decimal? ReceivedQuantity { get; set; }
        public Guid? UnitOfMeasure { get; set; }
        public decimal? SuppliersUnitCost { get; set; }
        public bool? DiscountType { get; set; }
        public decimal? DiscountAmount { get; set; }
        public decimal? DiscountedUnitCost { get; set; }
        public decimal? LineTotalCostTaxEclusive { get; set; }
        public Guid? TaxID { get; set; }
        public decimal? TaxRate { get; set; }
        public decimal? LineTotalTaxAmount { get; set; }
        public decimal? LineTotalCostTaxInclusive { get; set; }
        public string CurrencyID { get; set; }
        public decimal? FXRate { get; set; }
        public decimal? ForeignExchangeUnitCost { get; set; }
        public decimal? LineTotalForeignExchangeCostTaxExclusive { get; set; }
        public decimal? LineTotalForeignExchangeCostTaxInclusive { get; set; }
        public decimal? LineTotalHomeAmount { get; set; }
        public decimal? LineTotalForeignAmount { get; set; }
        public string SupplierSKU { get; set; }
        public string ClassificationID { get; set; }
        public string TaxCodeName { get; set; }
        public string ProductName { get; set; }
        public string GRNNo { get; set; }
        public string Type { get; set; }
        public string PurchaseOrderNumber { get; set; }
        public int? LineNo { get; set; }
    }
}

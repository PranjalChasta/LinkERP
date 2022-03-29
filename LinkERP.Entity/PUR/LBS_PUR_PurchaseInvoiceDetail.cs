using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
    public class LBS_PUR_PurchaseInvoiceDetail:BaseEntity
    {
 
      public Guid CompanyID { get; set; }
      public Guid PurchaseInvoiceID { get; set; }
      public string GRNNo { get; set; }
      public Guid PurchaseGoodsReceiveNoteID { get; set; }
      public Guid PurchaseGRNDetailsID { get; set; }
      public string PurchaseLineStatus { get; set; }
      public string ProductType { get; set; }
      public string ProductID { get; set; }
      public string ProductDescription { get; set; }
      public decimal InvoicingQuantity { get; set; }
      public string UnitOfMeasure { get; set; }
      public decimal SuppliersUnitCost { get; set; }
      public bool DiscountType { get; set; }
      public decimal DiscountAmount { get; set; }
      public decimal DiscountedUnitCost { get; set; }
      public decimal LineTotalCostTaxEclusiveHome { get; set; }
      public string TaxID { get; set; }
        public string TaxCodeName { get; set; }
        public decimal TaxRate { get; set; }
      public decimal LineTotalTaxAmountHome { get; set; }
        public decimal LineTotalTaxAmount { get; set; }
        public decimal LineTotalCostTaxInclusiveHome { get; set; }
      public string CurrencyID { get; set; }
      public decimal FXRate { get; set; }
      public decimal FXUnitCost { get; set; }
      public decimal LineTotalForeignExchangeCostTaxExclusive { get; set; }
      public decimal LineTotalForeignExchangeTaxAmount { get; set; }
      public string SupplierSKU { get; set; }
      public string ClassificationID { get; set; }
      public decimal LineTotalForeignExchangeCostTaxInclusive { get; set; }
      public decimal QuantityOnGRN { get; set; }
      public decimal GRNUnitCostExcludingTax { get; set; }
      public string PurchaseOrderNumber { get; set; }

    }
}

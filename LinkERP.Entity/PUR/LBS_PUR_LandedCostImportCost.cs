using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
    public class LBS_PUR_LandedCostImportCost:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid PurchaseLandedCostID { get; set; }
        public Guid VendorLedgerID { get; set; }
        public Guid VendorID { get; set; }
        public Guid CurrencyID { get; set; }
        public Guid TaxID { get; set; }
        public Guid CostLedgerID { get; set; }
        public string CostDescription { get; set; }
        public string CurrencyName { get; set; }
        public string InvoiceNo { get; set; }
        public decimal FXRate { get; set; }
        public decimal LineTotalTaxAmount { get; set; }
        public decimal TaxRate { get; set; }
        public decimal? LineTotalForeignExchangeCostTaxInclusive { get; set; }
        public decimal? LineTotalForeignExchangeCostTaxExclusive { get; set; }
        public decimal TotalExcludingTaxHome { get; set; }
        public decimal TotalLineTaxAmountHome { get; set; }
        public decimal LineTotalHomeAmountTaxInclusive { get; set; }
        public string VendorInvoiceID { get; set; }
        public string VendorAccountName { get; set; }
        public bool Apportion { get; set; }
        public string ApportionMethod { get; set; }
        public bool Invoiced { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime InvoiceDate { get; set; }

        public string IsTaxableImportSubmitted { get; set; }
        public string IsInvoiceSubmitted { get; set; }

    }
}

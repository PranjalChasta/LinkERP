using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
  public class LBS_PUR_LandedCostInvoices:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid PurchaseLandedCostID { get; set; }
        public Guid VendorLedgerID { get; set; }
        public Guid VendorID { get; set; }
        public Guid CurrencyID { get; set; }
        public string CurrencyName { get; set; }
        public string InvoiceNo { get; set; }
        public decimal FXRate { get; set; }
        public decimal ExpectedHomeAmount { get; set; }
        public decimal ExpectedFXAmount  { get; set; }
        public decimal BookedInFXAmount { get; set; }
        public decimal BookedInHomeAmount { get; set; }
        public string VendorInvoiceID { get; set; }
        public string VendorAccountName { get; set; }
        public bool Invoiced { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime InvoiceDate { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal HomeAmountIncTax { get; set; }
        public bool IsInvoiceSelected { get; set; }

        public string IsTaxableImportSubmitted { get; set; }
        public string IsImportCostSubmitted { get; set; }

    }
}

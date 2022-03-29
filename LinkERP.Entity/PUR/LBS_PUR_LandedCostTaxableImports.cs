using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
   public class LBS_PUR_LandedCostTaxableImports:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid PurchaseLandedCostID { get; set; }
        public Guid VendorID { get; set; }
        public Guid VendorLedgerID { get; set; }
        public Guid VendorInvoiceID { get; set; }
        public Guid TaxID { get; set; }
        public Guid TaxLedgerID { get; set; }
        public string ImportCostDescription { get; set; }
        public string InvoiceNo { get; set; }
        public decimal Amount { get; set; }
        public decimal TaxAmount { get; set; }
        public DateTime DueDate { get; set; }
        public bool Invoiced { get; set; }
        public DateTime InvoiceDate { get; set; }
        public string IsInvoiceSubmitted { get; set; }
        public string IsImportCostSubmitted { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
    public class LBS_PUR_PurchaseInvoice :BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string InvoiceNo { get; set; }
        public Guid VendorID { get; set; }
        public DateTime InvoiceDate { get; set; }
        public DateTime DueDate { get; set; }
        public bool Status { get; set; }
        public bool Reversed { get; set; }
        public decimal Freight { get; set; }
        public string FreightTaxID { get; set; }
        public decimal FreightTaxRate { get; set; }
        public decimal FreightTaxAmount { get; set; }
        public decimal Duty { get; set; }
        public string DutyTaxID { get; set; }
        public decimal DutyTaxRate { get; set; }
        public decimal DutyTaxAmount { get; set; }
        public decimal Insurance { get; set; }
        public string InsuranceTaxID { get; set; }
        public decimal InsuranceTaxRate { get; set; }
        public decimal InsuranceTaxAmount { get; set; }
        public decimal TotalExcludingTaxHome { get; set; }
        public decimal TotalTaxHome { get; set; }
        public decimal InvoiceToleranceAmount { get; set; }
        public decimal TotalIncludingTaxHome { get; set; }
        public decimal InvoicedHomeAmount { get; set; }
        public string CurrencyID { get; set; }
        public string VendorCode { get; set; }
        public string VendorAccountName { get; set; }
    }
}

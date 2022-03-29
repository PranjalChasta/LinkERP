using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.POS
{
    public class LBS_SOP_QuotationMain :BaseEntity
    {
        public Guid? CompanyID { get; set; }
        public Guid? DebtorID { get; set; }
        public string DebtorContactName { get; set; }
        public DateTime TransactionDate { get; set; }
        public string QuotationNo { get; set; }
        public string QuotationNotes1 { get; set; }
        public string QuotationNotes2 { get; set; }
        public bool? Status { get; set; }
        public Guid? WarehouseID { get; set; }
        public string WareHouseName { get; set; }
        public DateTime ExpectedDeliveryDate { get; set; }
        public string PriceSchemeID { get; set; }
        public decimal InvoiceTotal { get; set; }
        public string OpportunityStatus { get; set; }
        public string OpportunityStatusReason { get; set; }
        public string QuoteCompetitorWinner { get; set; }
        public decimal QuoteCompetitorPriceDiff { get; set; }
        public bool TaxIntegrationStatus { get; set; }
        public bool Printed { get; set; }
        public bool Emailed { get; set; }
        public string SalesPerson { get; set; }
        public string Company { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Address3 { get; set; }
        public string Address4 { get; set; }
        public string PostCode { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public string ContactName { get; set; }
        public string SDCInvoiceNumber { get; set; }
        public string SDCReprintInvoiceNumber { get; set; }
        public DateTime SDCDateTime { get; set; }
        public string SDCInvoiceCounter { get; set; }
        public string SDCVerificationURL { get; set; }
    }
}

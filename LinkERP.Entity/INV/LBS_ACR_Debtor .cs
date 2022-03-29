using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV
{
    public class LBS_ACR_Debtor:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string DebtorCode { get; set; }
        public string DebtorAccountName { get; set; }
        public string TaxIdentificationNumber { get; set; }
        public string TradingName { get; set; }
        public string CompanyName { get; set; }
        public string ProprietorName { get; set; }
        public string Laddr1 { get; set; }
        public string Laddr2 { get; set; }
        public string Laddr3 { get; set; }
        public string Paddr1 { get; set; }
        public string Paddr2 { get; set; }
        public string Paddr3 { get; set; }
        public string ZipCode { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
        public string EmailAddress { get; set; }
        public bool TradingStatus { get; set; }
        public string BankAccountName { get; set; }
        public string BankName { get; set; }
        public string BankAccountNumber { get; set; }
        public string BSB { get; set; }
        public string BankSwiftCode { get; set; }
        public bool? DefaultPaymentType { get; set; }
        public decimal? CreditLimit { get; set; }
        public DateTime? LastPurchaseDate { get; set; }
        public DateTime? LastPaymentDate { get; set; }
        public int? TermsDays { get; set; }
        public string PurchaseOrderValidityDays { get; set; }
        public decimal? CurrentBalance { get; set; }
        public decimal? Period1 { get; set; }
        public decimal? Period2 { get; set; }
        public decimal? Period3 { get; set; }
        public decimal? Period4 { get; set; }
        public bool? UseForeignCurrency { get; set; }
        public Guid? CurrencyID { get; set; }
        public decimal? FXCurrentBalance { get; set; }
        public decimal? FXPeriod1 { get; set; }
        public decimal? FXPeriod2 { get; set; }
        public decimal? FXPeriod3 { get; set; }
        public decimal? FXPeriod4 { get; set; }
        public Guid? DefaultSalesInvoiceWorkflow { get; set; }
        public Guid? Country { get; set; }
        public Guid? State { get; set; }
        public Guid? City { get; set; }
        public string WorkflowCode { get; set; }
        public string WorkFlowName { get; set; }
        public string CurrencyCode { get; set; }
        public string CurrecnyName { get; set; }
        public string CountryCode { get; set; }
        public string CountryName { get; set; }
        public string StateCode { get; set; }
        public string StateName { get; set; }
        public string CityCode { get; set; }
        public string CityName { get; set; }

        public string CreditLimit_text { get; set; }
        public string CurrentBalance_text { get; set; }
        public string Period1_text { get; set; }
        public string Period2_text { get; set; }
        public string Period3_text { get; set; }
        public string Period4_text { get; set; }
        public string FXCurrentBalance_text { get; set; }
        public string FXPeriod1_text { get; set; }
        public string FXPeriod2_text { get; set; }
        public string FXPeriod3_text { get; set; }
        public string FXPeriod4_text { get; set; }
        public Guid PriceWorkFlow { get; set; }
        public string PriceWorkflowDescription { get; set; }
        public string DescriptionText { get; set; }

    }
}

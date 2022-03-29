using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
    public class LBS_PUR_PurchaseMain : BaseEntity
    {
        public Guid CompanyID{get;set;}
        public Guid VendorID { get; set; }
        public Guid ShiptoWarehouse { get; set; }
        public Guid PurchaseOrderWorkflow { get; set; }
        public Guid VendorWareHouseID { get; set; }
        public string PurchaseOrderNumber { get; set; }
        public DateTime OrderedDate { get; set; }
        public DateTime ExpectedDeliveryDate { get; set; }
        public string PurchaseOrderValidityDays { get; set; }
        public string Status { get; set; }
        public string Attentionto  { get; set; }
        public string AttentionPhone { get; set; }
        public decimal? Freight { get; set; }
        public decimal? Duty  { get; set; }
        public decimal? Insurance  { get; set; }
        public string FreightTaxID  { get; set; }
        public decimal? FreightTaxRate  { get; set; }
        public decimal? FreightTaxAmount  { get; set; }
        public decimal? FreightTaxInclusive { get; set; }
        public string DutyTaxID  { get; set; }
        public decimal? DutyTaxRate { get; set; }
        public decimal? DutyTaxAmount  { get; set; }
        public decimal? DutyTaxInclusive { get; set; }
        public string InsuranceTaxID { get; set; }
        public decimal? POTotalTax  { get; set; }
        public string POTotalTax_text { get; set; }
        public decimal? InsuranceTaxRate { get; set; }
        public decimal? InsuranceTaxAmount  { get; set; }
        public decimal? InsuranceTaxInclusive { get; set; }
        public decimal? POTaxInclusiveTotal  { get; set; }
        public decimal? POTaxExclusiveTotal  { get; set; }
        public string NextApprover { get; set; } 
        public string ShiptoWareHouseName { get; set; }
        public string VendorAccountName { get; set; }
    }
}

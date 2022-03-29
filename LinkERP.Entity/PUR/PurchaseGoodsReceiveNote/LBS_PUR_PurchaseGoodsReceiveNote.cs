using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR.PurchaseGoodsReceiveNote
{
    public class LBS_PUR_PurchaseGoodsReceiveNote : BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid WareHouseID { get; set; }
        public string GRNNo { get; set; }
        public string SupplierDeliveryReference { get; set; }
        public Guid VendorID { get; set; }
        public DateTime ReceivedDate { get; set; }
        public bool Status { get; set; }
        public bool Reversed { get; set; }
        public bool Invoiced { get; set; }
        public Guid PurchaseInvoiceID { get; set; }
        public decimal? Insurance { get; set; }
        public string InsuranceTaxID { get; set; }
        public decimal? InsuranceTaxRate { get; set; }
        public decimal? InsuranceTaxAmount { get; set; }
        public decimal? Freight { get; set; }
        public string FreightTaxID { get; set; }
        public decimal? FreightTaxRate { get; set; }
        public decimal? FreightTaxAmount { get; set; }
        public decimal? Duty { get; set; }
        public string DutyTaxID { get; set; }
        public decimal? DutyTaxRate { get; set; }
        public decimal? DutyTaxAmount { get; set; }
        public decimal? TotalExclusiveofTax { get; set; }
        public decimal? TaxTotal { get; set; }
        public decimal? TotalInclusiveofTax { get; set; }
    }
}

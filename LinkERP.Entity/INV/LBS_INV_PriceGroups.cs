using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV
{
    public class LBS_INV_PriceGroups : BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string PriceClassCode { get; set; }
        public string PriceClassName { get; set; }
        public Guid? TaxCodeID { get; set; }
        public bool PromotionType { get; set; }
        public string PromotionDays { get; set; }
        public DateTime? PromotionDateFrom { get; set; }
        public DateTime? PromotionDateTo { get; set; }
        public DateTime? PromotionTimeFrom { get; set; }
        public DateTime? PromotionTimeTo { get; set; }
        public Guid? PriceChangeReason { get; set; }
        public decimal? PromotionalPrice { get; set; }
        public decimal? Quantity1 { get; set; }
        public decimal? Quantity2 { get; set; }
        public decimal? Quantity3 { get; set; }
        public decimal? Quantity4 { get; set; }
        public decimal? Quantity5 { get; set; }
        public decimal? Price1 { get; set; }
        public decimal? Price2 { get; set; }
        public decimal? Price3 { get; set; }
        public decimal? Price4 { get; set; }
        public decimal? Price5 { get; set; }

        public string PriceText { get; set; }
        public string Price1text { get; set; }
        public string Price2text { get; set; }
        public string Price3text { get; set; }
        public string Price4text { get; set; }
        public string Price5text { get; set; }
        public string Quantity1text { get; set; }
        public string Quantity2text { get; set; }
        public string Quantity3text { get; set; }
        public string Quantity4text { get; set; }
        public string Quantity5text { get; set; }
    }
}

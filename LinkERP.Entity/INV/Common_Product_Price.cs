using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV
{
    public class Common_Product_Price : BaseEntity
    {
        public decimal? PriceLevel1 { get; set; }
        public decimal? PriceLevel2 { get; set; }
        public decimal? PriceLevel3 { get; set; }
        public decimal? PriceLevel4 { get; set; }
        public decimal? PriceLevel5 { get; set; }
        public decimal? PriceLevel6 { get; set; }
        public decimal? PriceLevel7 { get; set; }
        public decimal? PriceLevel8 { get; set; }
        public decimal? PriceLevel9 { get; set; }
        public decimal? PriceLevel10 { get; set; }
        public bool? EnablCostPlusMarkup { get; set; }
        public decimal? MarkupPercentage { get; set; }
        public bool? PromotionType { get; set; }
        public Guid? PriceChangeReason { get; set; }
        
        public string PromotionDays { get; set; }

        public DateTime? PromotionDateFrom { get; set; }
        public DateTime? PromotionDateTo { get; set; }
        public DateTime? PromotionTimeFrom { get; set; }
        public DateTime? PromotionTimeTo { get; set; }

        public decimal? PromotionalPrice { get; set; }
        public decimal? PromotionQuantityLimit { get; set; }
        public decimal? PromotionQuantitySold { get; set; }
        public string quantityLimit_text { get; set; }
        public string quantitySold_text { get; set; }
        public decimal? QuantityBreak1 { get; set; }
        public decimal? QuantityBreak2 { get; set; }
        public decimal? QuantityBreak3 { get; set; }
        public decimal? QuantityBreak4 { get; set; }
        public decimal? QuantityBreak5 { get; set; }
        public decimal? PriceBreak1 { get; set; }
        public decimal? PriceBreak2 { get; set; }
        public decimal? PriceBreak3 { get; set; }
        public decimal? PriceBreak4 { get; set; }
        public decimal? PriceBreak5 { get; set; }

        public string PriceLevel1_text { get; set; }
        public string PriceLevel2_text { get; set; }
        public string PriceLevel3_text { get; set; }
        public string PriceLevel4_text { get; set; }
        public string PriceLevel5_text { get; set; }
        public string PriceLevel6_text { get; set; }
        public string PriceLevel7_text { get; set; }
        public string PriceLevel8_text { get; set; }
        public string PriceLevel9_text { get; set; }
        public string PriceLevel10_text { get; set; }

        public string PromotionalPrice_text { get; set; }
        public string QuantityBreak1_text { get; set; }
        public string QuantityBreak2_text { get; set; }
        public string QuantityBreak3_text { get; set; }
        public string QuantityBreak4_text { get; set; }
        public string QuantityBreak5_text { get; set; }
        public string PriceBreak1_text { get; set; }
        public string PriceBreak2_text { get; set; }
        public string PriceBreak3_text { get; set; }
        public string PriceBreak4_text { get; set; }
        public string PriceBreak5_text { get; set; }
        public string MarkupPercentage_text { get; set; }
    }
}

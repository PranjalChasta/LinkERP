using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.Inventory.Inventory_DebtorPrice
{
   public class LBS_INV_InventoryDebtorPrice: BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string ProductID { get; set; }
        public Guid CustomerID{ get; set; }
        public bool? EnablCostPlusMarkup { get; set; }
        public decimal? MarkupPercentage { get; set; }
        public bool PromotionType { get; set; }
        public decimal? PromotionQuantityLimit { get; set; }
        public decimal? PromotionQuantitySold { get; set; }
      
        public string PromotionDays { get; set; }
        public DateTime? PromotionDateFrom { get; set; }
        public DateTime? PromotionDateTo { get; set; }
        public DateTime? PromotionTimeFrom { get; set; }
        public DateTime? PromotionTimeTo { get; set; }
        public decimal? PromotionalPrice { get; set; }
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
        public string CustomerCode { get; set; } 
        public string CustomerName { get; set; }
        public Guid PriceChangeReason { get; set; }
        public string MarkupPercentage_text { get; set; }
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
        public string QuantityLimit_text { get; set; }
        public string QuantitySold_text { get; set; }
    }
}

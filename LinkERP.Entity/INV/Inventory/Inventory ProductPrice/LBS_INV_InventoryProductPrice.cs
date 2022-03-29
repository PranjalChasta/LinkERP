using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.Inventory.Inventory_ProductPrice
{
   public  class LBS_INV_InventoryProductPrice: Common_Product_Price
    {
        public Guid CompanyID { get; set; }
        public string ProductID { get; set; }
        public decimal? PromotionQuantityLimit { get; set; }
        public decimal? PromotionQuantitySold { get; set; }

        public string QuantityLimit_text { get; set; }
        public string QuantitySold_text { get; set; }
        //public decimal?  PriceLevel3 { get; set; }
        //public decimal?  PriceLevel4 { get; set; }
        //public decimal?  PriceLevel5 { get; set; }
        //public decimal?  PriceLevel6 { get; set; }
        //public decimal?  PriceLevel7 { get; set; }
        //public decimal?  PriceLevel8 { get; set; }
        //public decimal?  PriceLevel9 { get; set; }
        //public decimal?  PriceLevel10 { get; set; }
        //public bool EnablCostPlusMarkup { get; set; }
        //public decimal?  MarkupPercentage { get; set; }
        //public bool PromotionType { get; set; }
        //public string PromotionDays { get; set; }
        //public string PromotionDateFrom { get; set; }
        //public string PromotionDateTo { get; set; }
        //public string PromotionTimeFrom { get; set; }
        //public string PromotionTimeTo { get; set; }
        //public decimal?  PromotionalPrice { get; set; }
        //public decimal?  QuantityBreak1 { get; set; }
        //public decimal?  QuantityBreak2 { get; set; }
        //public decimal?  QuantityBreak3 { get; set; }
        //public decimal?  QuantityBreak4 { get; set; }
        //public decimal?  QuantityBreak5 { get; set; }
        //public decimal?  PriceBreak1 { get; set; }
        //public decimal?  PriceBreak2 { get; set; }
        //public decimal?  PriceBreak3 { get; set; }
        //public decimal?  PriceBreak4 { get; set; }
        //public decimal?  PriceBreak5 { get; set; }
    }
}

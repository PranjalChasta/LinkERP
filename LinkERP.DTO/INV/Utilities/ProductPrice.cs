using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.INV.Utilities
{
    public class ProductPrice
    {
        //DateTime _PromotionDateFrom;
        string _ProductCode, _PromotionDays;
        dynamic _EnablCostPlusMarkup;
        public string ProductCode
        {
            get { return _ProductCode; }
            set
            {
                if (value.Length >= 1 && value.Length <= 50)
                {
                    _ProductCode = value.Trim();
                }
                else
                {
                    throw new Exception("Invalid Product code data");
                }
            }
        }
        public decimal PriceLevel1 { get; set; }
        public decimal PriceLevel2 { get; set; }
        public decimal PriceLevel3 { get; set; }
        public decimal PriceLevel4 { get; set; }
        public decimal PriceLevel5 { get; set; }
        public decimal PriceLevel6 { get; set; }
        public decimal PriceLevel7 { get; set; }
        public decimal PriceLevel8 { get; set; }
        public decimal PriceLevel9 { get; set; }
        public decimal PriceLevel10 { get; set; }
        public dynamic EnablCostPlusMarkup
        {
            get { return _EnablCostPlusMarkup; }
            set
            {
                if (((string)value).ToLower() == "y")
                {
                    _EnablCostPlusMarkup = true;
                }
                else if (((string)value).ToLower() == "n")
                {
                    _EnablCostPlusMarkup = false;
                }
                else
                {
                    throw new Exception("Invalid Enable Cost Plus Markup data");
                }
            }
        }
        public decimal MarkupPercentage { get; set; }
        public dynamic PromotionType { get; set; }
        public string PromotionDays
        {
            get { return _PromotionDays; }
            set
            {
                if (value.Length >= 1 && value.Length <= 255)
                {
                    _PromotionDays = value.Trim();
                }
                else
                {
                    throw new Exception("Invalid Promotion Days data");
                }
            }
        }
        public DateTime PromotionDateFrom { get; set; }
        public DateTime PromotionDateTo { get; set; }
        //public DateTime PromotionDateTo
        //{
        //    get { return _PromotionDateFrom; }
        //    set
        //    {
        //        try { _PromotionDateFrom = value; }
        //        catch (Exception ex) { throw new Exception("Invalid Enable Cost Plus Markup data"); }
        //    }
        //}
        public DateTime PromotionTimeFrom { get; set; }
        public DateTime PromotionTimeTo { get; set; }
        public decimal PromotionalPrice { get; set; }
        public decimal QuantityBreak1 { get; set; }
        public decimal QuantityBreak2 { get; set; }
        public decimal QuantityBreak3 { get; set; }
        public decimal QuantityBreak4 { get; set; }
        public decimal QuantityBreak5 { get; set; }
        public decimal PriceBreak1 { get; set; }
        public decimal PriceBreak2 { get; set; }
        public decimal PriceBreak3 { get; set; }
        public decimal PriceBreak4 { get; set; }
        public decimal PriceBreak5 { get; set; }



    }
}

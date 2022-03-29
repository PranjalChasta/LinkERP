using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.POS.Quotation.QuotationDetails
{
    public class LBS_POS_InventoryDetails
    {
        public Guid ID { get; set; }
        public Guid ProductID { get; set; }
        public Guid PriceGroupID { get; set; }
        public string Description { get; set; }
        public decimal ProductWeight { get; set; }
        public decimal ProductCubic { get; set; }
        public int DecimalPlaces { get; set; }
        public string InventoryGLClassification { get; set; }
        public Guid UnitOfMeasureID { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public string ProductStatus { get; set; }
        public bool UseWareHousePrice { get; set; }
        public bool SerialisedProduct { get; set; }
        public bool ProductStyleMatrixEnabled { get; set; }
        public decimal InventoryDefaultCost { get; set; }
        public decimal TransactionQuantity { get; set; }
    }
}

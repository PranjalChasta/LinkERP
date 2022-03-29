using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
   public class LBS_INV_InventoryGLClassification:BaseEntity
    {
        public string ClassificationCode { get; set; }
        public string ClassificationName { get; set; }
        public string InventoryControlGL { get; set; }
        public string SalesGL { get; set; }
        public string SalesReturnsGL { get; set; }
        public string CostofGoodsPurchasedGL { get; set; }
        public string CostofGoodsSoldGL { get; set; }
        public string CostVarianceGL { get; set; }
    }
}

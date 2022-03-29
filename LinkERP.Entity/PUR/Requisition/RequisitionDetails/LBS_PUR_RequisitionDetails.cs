using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
   public class LBS_PUR_RequisitionDetails :BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid RequisitionID { get; set; }
        public int LineNo { get; set; }
        public string ProductType { get; set; }
        public Guid? ProductID { get; set; }
        public string ProductDescription { get; set; }
        public Guid? UnitOfMeasure { get; set; }
        public decimal? Quantity { get; set; }
        public string RequisitionLineStatus { get; set; } 
        public string ProductName { get; set; } 
        public string ProductCode { get; set; }
        public decimal? UnitPrice { get; set; }
        public string UOM { get; set; } 
        public bool? SerialisedProduct { get; set; }
        public bool? AllowPurchase { get; set; }
        public bool? ProductStyleMatrixEnabled { get; set; } 
        public string CheckStatus { get; set; }
    }

    public class RequisitionProductMatrix
    {
        public object ProductStyleMatrixRow { get; set; }
        public object ProductStyleMatrixColumn { get; set; }
        public object LBS_PUR_RequisitionDetailsProductStyleMatrix { get; set; } 
    }
}

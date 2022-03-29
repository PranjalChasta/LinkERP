using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.InventoryAdjustment
{
   public class LBS_INV_InventoryAdjustmentDetail_ProductStyleMatrix : BaseEntity
    {
        public Guid? CompanyID { get; set; }

        public Guid AdjustmentID { get; set; }
        public Guid? AdjustmentDetail_ID { get; set; }
        public Guid? ProductID { get; set; } 
        public string ProductName { get; set; }
        public string ProductCode { get; set; }
        public Guid? BinID { get; set; }
        public Guid? ProductMatrixRow { get; set; }
        public Guid? ProductMatrixColumn { get; set; }
        public string SerialNo { get; set; }
        public string SourceReference { get; set; }
        public DateTime? TransactionDateIn { get; set; }
        public string StyleMatrixDetailName { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public decimal? Quantity { get; set; }
        public string StyleMatrixName { get; set; } 
        public string RefId { get; set; }
    }
 
       

    public class AdjustmentProductMatrix
    {
        public object ProductStyleMatrixRow { get; set; }
        public object ProductStyleMatrixColumn { get; set; }
        public object InventoryAdjustmentDetail_ProductStyleMatrix { get; set; }
    }
  }

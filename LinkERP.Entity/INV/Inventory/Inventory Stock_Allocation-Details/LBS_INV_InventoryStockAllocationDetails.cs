using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.Inventory.Inventory_Stock_Allocation_Details
{
    public class LBS_INV_InventoryStockAllocationDetails:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid WareHouseID { get; set; }
        public string ProductID { get; set; }
        public Guid BinID { get; set; }
        public string BinName { get; set; }
        public Guid ProductMatrixRow { get; set; }
        public Guid  ProductMatrixColumn { get; set; }
        public string SerialNo { get; set; }
        public DateTime? TransactionDateIn { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public decimal? QuantityIn   { get; set; }
        public decimal? QuantityOnHand { get; set; }
        public decimal? CostIn { get; set; }
        public string SourceReference { get; set; }
        public string AdjustmentRefID { get; set; }
        public decimal? AdjQty { get; set; }
        public decimal? RequestedQty { get; set; } 
        public decimal? ShippedQty { get; set; }
        public decimal? ReceivedQty { get; set; }
        public string AdDetailSrnoId { get; set; } 
        public string ProductMatrixRowname { get; set; }
        public string ProductMatrixColumnname { get; set; }
        public string StyleMatrixName { get; set; }
        public string StyleMatrixDetailName { get; set; }
        public string ColumnName { get; set; }
        public string CostIn_text { get; set; }
    }
}

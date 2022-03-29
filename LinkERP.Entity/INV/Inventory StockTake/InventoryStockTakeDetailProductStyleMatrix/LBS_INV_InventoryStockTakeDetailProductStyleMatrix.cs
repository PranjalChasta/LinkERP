using LinkERP.Entity.INV.Inventory_StockTake;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.Inventory.InventoryStockDetail 
{
    public class LBS_INV_InventoryStockTakeDetailProductStyleMatrix : BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string StockTakeNo { get; set; }
        public string ProductID { get; set; }
        public Guid? BinID { get; set; }
        public Guid? StockTakeDetailID { get; set; }
        public Guid? StockAllocationDetailID { get; set; }
        public Guid? ProductMatrixRow { get; set; }
        public Guid? ProductMatrixColumn { get; set; }
        public string SerialNo { get; set; }
        public string SourceReference { get; set; }
        public DateTime? TransactionDateIn { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public decimal? CurrentAvailableQuantity { get; set; }
        public decimal? CountQuantity { get; set; }
        public decimal? VarianceQuantity { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public string BinCode { get; set; }
        public string BinName { get; set; }
        public string StyleMatrixCode { get; set; }
        public string StyleMatrixName { get; set; }
        public string StockTakeStatus { get; set; }
        public string ProductMatrixRowName { get; set; }
        public string ProductMatrixColumnName { get; set; }
    }

    public class StockTakeDetailProductMatrix
    {
        public object ProductStyleMatrixRow { get; set; }
        public object ProductStyleMatrixColumn { get; set; }
        public object InventoryStockTakeDetailProductStyleMatrix { get; set; }
    }
}
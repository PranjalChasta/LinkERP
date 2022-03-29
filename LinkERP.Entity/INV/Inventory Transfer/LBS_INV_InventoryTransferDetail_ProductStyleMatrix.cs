using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.Inventory_Transfer
{
    public class LBS_INV_InventoryTransferDetail_ProductStyleMatrix : BaseEntity
    {
        public Guid? CompanyID { get; set; }
        public Guid TransferID { get; set; }
        public Guid? TransferDetailID { get; set; }
        public Guid ProductID { get; set; }
        public Guid? BinID { get; set; }
        public Guid? ProductMatrixRow { get; set; }
        public Guid? ProductMatrixColumn { get; set; }
        public string SerialNo { get; set; }
        public string SourceReference { get; set; }
        public DateTime? TransactionDateIn { get; set; }
        public string StyleMatrixDetailName { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public decimal? RequestedQty { get; set; }
        public decimal? ShippedQty { get; set; }
        public decimal? ReceivedQty { get; set; }
        public string RowHeaderName { get; set; }
        public string ColumnHeaderName { get; set; }
        public string RefId { get; set; }
        public decimal? PreviouslyReceviedQty { get; set; }
        public string RequestedQty_text { get; set; }
        public string ShippedQty_text { get; set; }
        public string ReceivedQty_text { get; set; }
        public string ProductMatrixRowname { get; set; }
        public string ProductMatrixColumnname { get; set; }
        public string BinName { get; set; }
        public decimal? QuantityOnHand { get; set; }
    } 
    public class TransferProductMatrix
    {
        public object ProductStyleMatrixRow { get; set; }
        public object ProductStyleMatrixColumn { get; set; }
        public object InventoryTransferDetail_ProductStyleMatrix { get; set; }
        public object InventoryTransferDetail_ProductStyleMatrixshipped { get; set; }
    }
}

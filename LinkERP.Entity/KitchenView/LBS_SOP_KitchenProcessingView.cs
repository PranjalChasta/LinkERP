using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.KitchenView
{
    public class LBS_SOP_KitchenProcessingView:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public DateTime TransactionDate { get; set; }
        public Guid TransactionSourceID { get; set; }
        public Guid TransactionSourceLineID { get; set; }
        public string TableNo { get; set; }
        public Guid ProductID { get; set; }
        public string Description { get; set; }
        public decimal Quantity { get; set; }
        public decimal UOM { get; set; }
        public Guid WarehouseID { get; set; }
        public string Status { get; set; }
        public decimal ReadytoInprogressDuration { get; set; }
        public decimal InprogresstoDeliveredDuration { get; set; }
        public decimal TotalDuration { get; set; }
        public bool Printed { get; set; }
        public string NewOrders { get; set; }
        public string Cancelled { get; set; }
        public string New { get; set; }
        public string InProgress { get; set; }
        public string Ready { get; set; }



    }
}

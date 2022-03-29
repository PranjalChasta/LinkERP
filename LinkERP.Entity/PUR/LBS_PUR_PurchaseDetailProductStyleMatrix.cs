using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
    public class LBS_PUR_PurchaseDetailProductStyleMatrix : BaseEntity
    {
        public Guid? CompanyID { get; set; }
        public Guid? PurchaseDetailID { get; set; } 
        public Guid? ProductID { get; set; }
        public Guid? ProductMatrixRow { get; set; }
        public Guid? ProductMatrixColumn { get; set; }
        public string SerialNo { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public decimal? PurchaseQuantity { get; set; }
        public string styleMatrixDetailName { get; set; }

    }

    public class PurchaseProductMatrix
    {
        public object ProductStyleMatrixRow { get; set; }
        public object ProductStyleMatrixColumn { get; set; }
        public object LBS_PUR_PurchaseDetailsProductStyleMatrix { get; set; }
    }
}

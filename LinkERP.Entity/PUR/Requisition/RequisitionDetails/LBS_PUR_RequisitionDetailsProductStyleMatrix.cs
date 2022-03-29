using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR.Requisition.RequisitionDetails
{
    public class LBS_PUR_RequisitionDetailsProductStyleMatrix : BaseEntity
    {
        public Guid? CompanyID { get; set; }
        public Guid? RequisitionID { get; set; }
        public Guid? RequisitionDetailID { get; set; }
        public Guid? ProductID { get; set; }
        public Guid? ProductMatrixRow { get; set; }
        public Guid? ProductMatrixColumn { get; set; }
        public string SerialNo { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public decimal? PurchaseQuantity { get; set; } 
        public string styleMatrixDetailName { get; set; } 
    }
}

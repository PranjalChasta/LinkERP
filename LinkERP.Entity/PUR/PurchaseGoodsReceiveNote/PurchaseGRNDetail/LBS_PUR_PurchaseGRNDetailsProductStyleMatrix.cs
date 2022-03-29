using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR.PurchaseGoodsReceiveNote.PurchaseGRNDetail
{
   public class LBS_PUR_PurchaseGRNDetailsProductStyleMatrix : BaseEntity
    {
        public Guid? CompanyID { get; set; }
        public Guid? PurchaseGRNDetailsID { get; set; }
        public Guid? ProductID { get; set; }
        public Guid? BinID { get; set; }
        public Guid? ProductMatrixRow { get; set; }
        public Guid? ProductMatrixColumn { get; set; }
        public string SerialNo { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public decimal? PurchaseQuantity { get; set; }
        public string styleMatrixDetailName { get; set; }
    }
}

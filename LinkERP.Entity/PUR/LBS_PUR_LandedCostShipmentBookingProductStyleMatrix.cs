using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
    public class LBS_PUR_LandedCostShipmentBookingProductStyleMatrix:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid ShipmentBookingDetaiID { get; set; }
        public Guid ProductID { get; set; }
        public Guid BinID { get; set; }
        public Guid ProductMatrixRow { get; set; }
        public Guid ProductMatrixColumn { get; set; }
        public string SerialNo { get; set; }
        public DateTime ExpiryDate { get; set; }
        public decimal? PurchaseQuantity { get; set; }

        public string StyleMatrixName { get; set; }
        public string BinName { get; set; }
        public string ProductName { get; set; }
        public string ShipmentNumber { get; set; }
    }
}

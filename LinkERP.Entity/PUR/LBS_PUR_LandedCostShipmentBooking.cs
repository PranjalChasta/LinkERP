using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
  public  class LBS_PUR_LandedCostShipmentBooking:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid PurchaseLandedCostID { get; set; }
        public string BookingNumber { get; set; }
        public string Description { get; set; }
        public string PurchaseOrderNumber { get; set; }
        public string ProductNo { get; set; }
        public string SerialNo { get; set; }
        public string BinLocation { get; set; }
        public Guid BinID { get; set; }
        public DateTime BookInDate { get; set; }
        public decimal Quantity { get; set; }
        public decimal CostIn { get; set; }


    }
}

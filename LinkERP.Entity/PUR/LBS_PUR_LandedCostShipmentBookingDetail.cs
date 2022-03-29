using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
    public class LBS_PUR_LandedCostShipmentBookingDetail:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid ShipmentBookingID { get; set; }
        public Guid ShipmentLineID { get; set; }
        public string ProductType { get; set; }
        public Guid ProductID { get; set; }
        public string ProductCode { get; set; }
        public string Description { get; set; }
        public bool UseSerialNo { get; set; }
        public bool UseExpiry { get; set; }
        public decimal Weight { get; set; }
        public decimal Volume { get; set; }
        public decimal QuantityOrdered { get; set; }
        public string QuantityReceived { get; set; }
        public decimal QuantityOutstanding { get; set; }
        public string QuantitytoReceive { get; set; }
        public decimal LandedUnitCostTaxExclusiveHome { get; set; }
    }
}

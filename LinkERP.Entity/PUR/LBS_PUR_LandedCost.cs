using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
    public class LBS_PUR_LandedCost : BaseEntity
    {
        public Guid CompanyID{get;set;}
        public Guid WarehouseID { get; set; }
        public Guid ShipmentClearanceAgency { get; set; }
        public string ShipmentNo { get; set; }
        public string Status { get; set; }
        public DateTime ShipInitDate { get; set; }
        public string WayBillNo { get; set; }
        public string VesselName { get; set; }
        public string ContainerNo { get; set; }
        public string ShipmentNotes  { get; set; }
        public DateTime ShipmentDepartureDate { get; set; }
        public DateTime ShipmentArrivalDate { get; set; }
        public DateTime ShipmentReceiptDate { get; set; }
        public DateTime ExpectedArrivalDate { get; set; }
        public string VendorAccountName { get; set; }
        public string IsPOSubmitted { get; set; }
    }
}

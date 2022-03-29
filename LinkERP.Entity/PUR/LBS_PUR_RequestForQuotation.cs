using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
    public class LBS_PUR_RequestForQuotation:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid RequisitionID { get; set; }
        public string RequisitionNumber { get; set; }
        public Guid WarehouseID { get; set; }
        public string WareHouseName { get; set; }
        public DateTime ExpectedDeliveryDate { get; set; }
        public decimal Amount { get; set; }
        public string RequestedBY { get; set; }
        public string Sendto { get; set; }

        public Guid? VendorID { get; set; }

    }
}

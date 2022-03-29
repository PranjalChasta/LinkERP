using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.PUR.Common
{
    public class PurchaseOrders
    {
        public Guid ID { get; set; }
        public string PurchaseOrderNumber { get; set; }
        public DateTime OrderedDate { get; set; }
        public string Vendor { get; set; }
    }
}

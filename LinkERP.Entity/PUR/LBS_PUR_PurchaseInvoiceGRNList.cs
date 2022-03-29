using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
    public class LBS_PUR_PurchaseInvoiceGRNList:BaseEntity
    {

        public Guid GRNID { get; set; }
        public Guid WareHouseID { get; set; }
        public string GRNNumber { get; set; }
        public Guid VendorID { get; set; }
        public DateTime ReceivedDate { get; set; }
    }
}

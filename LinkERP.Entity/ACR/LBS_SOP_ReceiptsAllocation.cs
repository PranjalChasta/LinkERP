using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.ACR
{
    public class LBS_SOP_ReceiptsAllocation
    {
        public Guid ID { get; set; }
        public bool Deleted { get; set; }
        public Guid CompanyID { get; set; }
        public Guid InvoiceID { get; set; }
        public Guid ReceiptsID { get; set; }
        public decimal AllocatedAmount { get; set; }
        public Guid ReceiptsMainID { get; set; }
        public string CreatedBY { get; set; }
    }
}

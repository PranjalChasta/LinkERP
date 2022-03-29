using LinkERP.Entity.PUR;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.PUR.GoodsReceivedNote
{
    public class PurchaseOrdersDetails
    {
        public PurchaseMain PurchaseMain { get; set; }
        public IList<PurchaseDetails> PurchaseDetails { get; set; }

    }
}

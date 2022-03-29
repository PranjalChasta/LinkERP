using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
     public class LBS_PUR_PurchaseInvoiceGRN
    {
        public LBS_PUR_PurchaseInvoice PurchaseInvoice { get; set; }
        public IList<LBS_PUR_PurchaseInvoiceGRNList> PurchaseInvoiceGRN { get; set; }
}
}

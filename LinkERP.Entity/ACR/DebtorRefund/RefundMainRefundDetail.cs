using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.ACR.DebtorRefund
{
   public  class RefundMainRefundDetail
    {
       public LBS_SOP_RefundMain lBS_SOP_RefundMain { get; set; }

       public IList<LBS_SOP_RefundDetail> lBS_SOP_RefundDetail { get; set; }
    }
}

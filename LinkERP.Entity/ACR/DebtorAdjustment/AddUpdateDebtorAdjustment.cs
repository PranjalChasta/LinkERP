using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.ACR.DebtorAdjustment
{
    public class AddUpdateDebtorAdjustment
    {
        public LBS_ACR_DebtorAdjustmentMain lBS_SOP_Adjustment { get; set; }
        public IList<LBS_ACR_DebtorAdjustmentDetail> lBS_SOP_AdjustmentDetail { get; set; }
    }
}

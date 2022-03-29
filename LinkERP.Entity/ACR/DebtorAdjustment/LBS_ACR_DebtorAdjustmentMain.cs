using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.ACR.DebtorAdjustment
{
    public class LBS_ACR_DebtorAdjustmentMain
    {
        public Guid ID {get;set;}
        public Guid CompanyID { get; set; }
        public string BatchNo { get; set; }
        public bool Status { get; set; }
        public string BatchDate { get; set; }
        public string  Description { get; set; }
        public string CreatedBY { get; set; }
        public string Status_Text { get; set; }
        public string DeleteStatus { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.POS
{
    public class LBS_POS_CreditReasons : BaseEntity
    {
        public Guid? CompanyID { get; set; }
        public string CreditReasonDescription { get; set; }
        public bool Default { get; set; }
        public bool CreditIntoStock { get; set; }
    }
}

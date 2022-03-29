using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
   public class LBS_SYS_Bank : BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string BankName{ get; set; }
        public string BankCode { get; set; }
        public string BankNumber { get; set; }
    }
}

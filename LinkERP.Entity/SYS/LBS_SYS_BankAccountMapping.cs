using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
   public class LBS_SYS_BankAccountMapping : BaseEntity
    {
        public string BankName { get; set; }
        public Guid BankCode { get; set; }
        public string Code { get; set; }
        public string BankNumber { get; set; }
        

    }
}

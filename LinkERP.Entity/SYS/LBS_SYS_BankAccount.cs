using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
   public class LBS_SYS_BankAccount :BaseEntity
    {
        public string AccountName  { get; set; }
        public string AccountNo { get; set; }
        public bool DefaultAccount{ get; set; }
        public string RegNo { get; set; }

    }
}

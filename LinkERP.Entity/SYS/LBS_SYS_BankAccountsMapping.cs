using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
    public class LBS_SYS_BankAccountsMapping : BaseEntity
    {
        public Guid BankCodeFrom { get; set; }
        public Guid BankCodeTo { get; set; }
        public string BankNumber { get; set; }

    }
}
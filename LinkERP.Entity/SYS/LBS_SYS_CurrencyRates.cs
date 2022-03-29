using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
    public class LBS_SYS_CurrencyRates : BaseEntity
    {
        public Guid CurrencyID { get; set; }
        //public int LineNumber { get; set; }
        public DateTime EffectiveDate { get; set; }
        public DateTime DateEnd { get; set; }
        public decimal? TransactionRate { get; set; }
        public string DataName { get; set; }
        public string CurrecnyName { get; set; }
        public string CurrencyCode { get; set; }

    }
}

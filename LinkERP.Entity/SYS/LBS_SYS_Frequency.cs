using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
    public class LBS_SYS_Frequency : BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string FrequencyName { get; set; }
        public string FrequencyType { get; set; }
        public decimal Frequency { get; set; }
        public DateTime? DateTimeStart { get; set; }
        public DateTime? DateTimeEnd { get; set; }
        public string ExecuteDateTime { get; set; }
        public string flag { get; set; }
        public string Name { get; set; }
        public string Frequencytext { get; set; }

    }
}

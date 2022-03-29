using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.SYS.ReportSchedule
{
    public class ReportSchedule
    {
        public Guid ID { get; set; }
        public Guid FrequencyID { get; set; }
        public string FrequencyName { get; set; }
        public Guid ReportID { get; set; }
        public string ReportName { get; set; }
        public string Description { get; set; }
        public string Subject { get; set; }
        public string EmailTo { get; set; }
        public DateTime LastRunDate { get; set; }
        public DateTime NextRunDate { get; set; }        
        public string CreatedBy { get; set; }
        public DateTime DateCreated { get; set; }
        public string DeleteStatus { get; set; }
    }
}

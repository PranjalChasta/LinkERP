using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
    public class LBS_SYS_ReportSchedule : BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid FrequencyID { get; set; }
        public Guid ReportID { get; set; }       
        public string Description { get; set; }
        public string Subject { get; set; }
        public string EmailTo { get; set; }
        public string EmailSendMode { get; set; }
        public DateTime? LastRunDate { get; set; }
        public DateTime? NextRunDate { get; set; }
        public string EmailReportOption { get; set; }
        public string ReportUser { get; set; }
        public string DocumentTemplate { get; set; }
        public DateTime? DateFromType { get; set; }
        public DateTime? DateToType { get; set; }
        public int OffSetDateFrom { get; set; }
        public int OffSetDateTo { get; set; }
        public string FrequencyName { get; set; }
        public string ReportName { get; set; }
    }
}

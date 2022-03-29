using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.Report
{
    public class EmailReport
    {
        public string Subject { get; set; }
        public string Emails { get; set; }
        public Guid DocumentTemplateID { get; set; }
        public IList<string> UserEmails { get; set; }
        public object ReportParameters { get; set; }
    }
}

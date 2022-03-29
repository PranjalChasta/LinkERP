using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.Reports
{
    public class LBS_SYS_ReportMetadata
    {
        public Guid ID { get; set; }
        public string ReportCode { get; set; }
        public string ReportName { get; set; }
        public string ReportPath { get; set; }
        public string ModuleID { get; set; }
        public string MenuID { get; set; }
        public bool Deleted { get; set; }       
    }
}

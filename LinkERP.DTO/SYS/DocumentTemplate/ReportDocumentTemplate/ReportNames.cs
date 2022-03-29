using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.SYS.DocumentTemplate.ReportDocumentTemplate
{
    public class ReportNames
    {
        public Guid ID { get; set; }
        public string ReportCode { get; set; }
        public string ReportName { get; set; }
        public string ReportPath { get; set; }
        public string ModuleID { get; set; }
        public int MenuID { get; set; }
    }
}

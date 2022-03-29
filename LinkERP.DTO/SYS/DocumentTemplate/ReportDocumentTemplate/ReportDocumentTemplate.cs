using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.SYS.DocumentTemplate.ReportDocumentTemplate
{
    public class ReportDocumentTemplate
    {
        public Guid ID { get; set; }
        public string ReportCode { get; set; }
        public string ReportName { get; set; }
        public bool Deleted { get; set; }       
    }
}
    
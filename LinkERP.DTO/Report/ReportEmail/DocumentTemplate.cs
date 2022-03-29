using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.Report.ReportEmail
{
    public class DocumentTemplate
    {
        public Guid ID { get; set; }
        public string TemplateName { get; set; }
        public string TemplateData { get; set; }

    }
}

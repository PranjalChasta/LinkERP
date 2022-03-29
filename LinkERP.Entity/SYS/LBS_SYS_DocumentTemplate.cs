using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
    public class LBS_SYS_DocumentTemplate : BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string TemplateName { get; set; }
        public string TemplateData { get; set; }
        public string CompanyName{get;set;}
    }
}

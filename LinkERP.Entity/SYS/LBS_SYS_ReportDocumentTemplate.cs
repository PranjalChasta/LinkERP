using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
    public class LBS_SYS_ReportDocumentTemplate : BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid DocumentTemplateID { get; set; }
        public Guid ReportID { get; set; }       
    }
}

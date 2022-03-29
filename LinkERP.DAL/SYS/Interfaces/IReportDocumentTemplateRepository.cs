using LinkERP.DTO.SYS.DocumentTemplate.ReportDocumentTemplate;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SYS.Interfaces
{
    public interface IReportDocumentTemplateRepository
    {
        Guid AddReportDocumentTemplate(LBS_SYS_ReportDocumentTemplate lBS_SYS_ReportDocumentTemplate);
        IList<ReportNames> GetReportNames(Guid DocumentTemplateID, Guid CompanyID);
        IList<ReportDocumentTemplate> GetReportDocumentTemplate(Guid DocumentTemplateID, Guid CompanyID);
    }
}

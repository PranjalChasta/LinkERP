using LinkERP.DTO.Report.ReportEmail;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.Reports.Interfaces
{
    public interface IReportEmailService
    {
        IList<UsersEMail> GetUsersEMails();
        IList<DocumentTemplate> GetDocumentTemplatesByReport(Guid ReportID);
        DocumentTemplate GetDocumentTemplatesByID(Guid DocumentTemplateID);

    }
}

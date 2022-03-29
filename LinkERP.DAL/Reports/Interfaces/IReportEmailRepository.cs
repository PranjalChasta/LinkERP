using LinkERP.DTO.Report.ReportEmail;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.Reports.Interfaces
{
    public interface IReportEmailRepository
    {
        IList<UsersEMail> GetUsersEMails();
        IList<DocumentTemplate> GetDocumentTemplatesByReport(Guid ReportID);
        DocumentTemplate GetDocumentTemplatesByID(Guid DocumentTemplateID);
    }
}

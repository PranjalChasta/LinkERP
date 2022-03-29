using LinkERP.BLL.Reports.Interfaces;
using LinkERP.DAL.Reports.Interfaces;
using LinkERP.DTO.Report.ReportEmail;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.Reports
{
    public class ReportEmailService : IReportEmailService
    {
        IReportEmailRepository reportEmailRepository;
        public ReportEmailService(IReportEmailRepository _reportEmailRepository)
        {
            reportEmailRepository = _reportEmailRepository;
        }

        public DocumentTemplate GetDocumentTemplatesByID(Guid DocumentTemplateID)
        {
            return reportEmailRepository.GetDocumentTemplatesByID(DocumentTemplateID);
        }

        public IList<DocumentTemplate> GetDocumentTemplatesByReport(Guid ReportID)
        {
            return reportEmailRepository.GetDocumentTemplatesByReport(ReportID);
        }

        public IList<UsersEMail> GetUsersEMails()
        {
            return reportEmailRepository.GetUsersEMails();
        }
    }
}

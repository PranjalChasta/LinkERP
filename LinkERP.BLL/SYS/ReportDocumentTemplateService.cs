using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.DTO.SYS.DocumentTemplate.ReportDocumentTemplate;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS
{
    public class ReportDocumentTemplateService : IReportDocumentTemplateService
    {
        IReportDocumentTemplateRepository reportDocumentTemplateRepository;
        public ReportDocumentTemplateService(IReportDocumentTemplateRepository _reportDocumentTemplateRepository)
        {
            reportDocumentTemplateRepository = _reportDocumentTemplateRepository;
        }

        public Guid AddReportDocumentTemplate(LBS_SYS_ReportDocumentTemplate lBS_SYS_ReportDocumentTemplate)
        {
            return reportDocumentTemplateRepository.AddReportDocumentTemplate(lBS_SYS_ReportDocumentTemplate);
        }

        public IList<ReportDocumentTemplate> GetReportDocumentTemplate(Guid DocumentTemplateID, Guid CompanyID)
        {
            return reportDocumentTemplateRepository.GetReportDocumentTemplate(DocumentTemplateID, CompanyID);
        }
        public IList<ReportNames> GetReportNames(Guid DocumentTemplateID, Guid CompanyID)
        {
            return reportDocumentTemplateRepository.GetReportNames(DocumentTemplateID, CompanyID);
        }
    }
}

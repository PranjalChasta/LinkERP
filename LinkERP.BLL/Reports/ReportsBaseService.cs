using LinkERP.BLL.Reports.Interfaces;
using LinkERP.DAL.Reports.Interfaces;
using LinkERP.Entity.Reports;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.Reports
{
    public class ReportsBaseService : IReportsBaseService
    {
        IReportsBaseRepository reportsBaseRepository;
        public ReportsBaseService(IReportsBaseRepository _reportsBaseRepository)
        {
           reportsBaseRepository = _reportsBaseRepository;
        }
        public IList<LBS_SYS_ReportMetadata> GetReportsByModule(string ModuleID)
        {
            return reportsBaseRepository.GetReportsByModule(ModuleID);
        }
        public IList<LBS_SYS_ReportMetadataDetails> GetReportsParametersDetailsByReportID(Guid ReportID)
        {
            return reportsBaseRepository.GetReportsParametersDetailsByReportID(ReportID);

        }
    }
}

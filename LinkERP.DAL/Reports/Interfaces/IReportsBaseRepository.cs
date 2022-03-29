using LinkERP.Entity.Reports;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.Reports.Interfaces
{
    public interface IReportsBaseRepository
    {
        IList<LBS_SYS_ReportMetadata> GetReportsByModule(string ModuleID);
        IList<LBS_SYS_ReportMetadataDetails> GetReportsParametersDetailsByReportID(Guid ReportID);
    }
}

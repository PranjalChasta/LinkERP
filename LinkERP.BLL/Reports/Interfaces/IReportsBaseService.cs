using LinkERP.Entity.Reports;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.Reports.Interfaces
{
    public interface IReportsBaseService
    {
        IList<LBS_SYS_ReportMetadata> GetReportsByModule(string ModuleID);
        IList<LBS_SYS_ReportMetadataDetails> GetReportsParametersDetailsByReportID(Guid ReportID);
    }
}

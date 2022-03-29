using Dapper;
using LinkERP.DAL.Reports.Interfaces;
using LinkERP.Entity.Reports;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace LinkERP.DAL.Reports
{
    public class ReportsBaseRepository : BaseRepository, IReportsBaseRepository
    {
        public IList<LBS_SYS_ReportMetadata> GetReportsByModule(string ModuleID)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@ModuleID", ModuleID);
            var reports = con.Query<LBS_SYS_ReportMetadata>("SYS_GetReportsByModule",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return reports;
        }

        public IList<LBS_SYS_ReportMetadataDetails> GetReportsParametersDetailsByReportID(Guid ReportID)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@ReportID", ReportID);
            var reportsPrameters = con.Query<LBS_SYS_ReportMetadataDetails>("SYS_GetReportsParametersDetailsByReportID",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return reportsPrameters;
        }
    }
}

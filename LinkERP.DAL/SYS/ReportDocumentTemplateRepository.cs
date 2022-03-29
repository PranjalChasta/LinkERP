using Dapper;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.DTO.SYS.DocumentTemplate.ReportDocumentTemplate;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace LinkERP.DAL.SYS
{
    public class ReportDocumentTemplateRepository : BaseRepository, IReportDocumentTemplateRepository
    {
        public Guid AddReportDocumentTemplate(LBS_SYS_ReportDocumentTemplate lBS_SYS_ReportDocumentTemplate)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", lBS_SYS_ReportDocumentTemplate.CompanyID);
            parameters.Add("@DocumentTemplateID", lBS_SYS_ReportDocumentTemplate.DocumentTemplateID);
            parameters.Add("@ReportID", lBS_SYS_ReportDocumentTemplate.ReportID);
            parameters.Add("@CreatedBy", lBS_SYS_ReportDocumentTemplate.CreatedBY);
            parameters.Add("@Action", "Add");
            parameters.Add("@ReportDocumentTemplateID", dbType: DbType.Guid, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_ReportDocumentTemplateManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<Guid>("@ReportDocumentTemplateID");
            return id;
        }

        public IList<ReportNames> GetReportNames(Guid DocumentTemplateID, Guid CompanyID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", CompanyID);
            parameters.Add("@DocumentTemplateID", DocumentTemplateID);
            parameters.Add("@Action", "ReportNameForDocumentTemplate");


            var data = con.Query<ReportNames>("SYS_ReportDocumentTemplateManagement",
                              param: parameters,
                              commandType: CommandType.StoredProcedure).AsList();

            return data;
        }
        public IList<ReportDocumentTemplate> GetReportDocumentTemplate(Guid DocumentTemplateID, Guid CompanyID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", CompanyID);
            parameters.Add("@DocumentTemplateID", DocumentTemplateID);
            parameters.Add("@Action", "ReportDocumentTemplate");

            var data = con.Query<ReportDocumentTemplate>("SYS_ReportDocumentTemplateManagement",
                              param: parameters,
                              commandType: CommandType.StoredProcedure).AsList();

            return data;
        }
    }
}

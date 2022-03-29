using Dapper;
using LinkERP.DAL.Reports.Interfaces;
using LinkERP.DTO.Report.ReportEmail;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace LinkERP.DAL.Reports
{
    public class ReportEmailRepository : BaseRepository, IReportEmailRepository
    {
        public IList<UsersEMail> GetUsersEMails()
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@Action", "UsersEmail");

            var data = con.Query<UsersEMail>("SYS_ReportEmailManagement",
                               param: parameters,
                               commandType: CommandType.StoredProcedure).AsList();

            return data;
        }

        public IList<DocumentTemplate> GetDocumentTemplatesByReport(Guid ReportID)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@ReportID", ReportID);
            parameters.Add("@Action", "DocumentTemplateByReport");

            var data = con.Query<DocumentTemplate>("SYS_ReportEmailManagement",
                               param: parameters,
                               commandType: CommandType.StoredProcedure).AsList();

            return data;
        }
        public DocumentTemplate GetDocumentTemplatesByID(Guid DocumentTemplateID)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@DocumentTemplateID", DocumentTemplateID);
            parameters.Add("@Action", "DocumentTemplateByID");

            var data = con.Query<DocumentTemplate>("SYS_ReportEmailManagement",
                               param: parameters,
                               commandType: CommandType.StoredProcedure).FirstOrDefault();

            return data;
        }
    }
}

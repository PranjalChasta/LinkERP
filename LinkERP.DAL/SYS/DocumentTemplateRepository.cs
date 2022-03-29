using Dapper;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.DTO.SYS.DocumentTemplate.ReportDocumentTemplate;
using LinkERP.Entity;
using LinkERP.Entity.SYS;
using LinkERP.Entity.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace LinkERP.DAL.SYS
{
    public class DocumentTemplateRepository :BaseRepository,IDocumentTemplateRepository
    {
        public string AddDocumentTemplate(LBS_SYS_DocumentTemplate lBS_SYS_DocumentTemplate)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", lBS_SYS_DocumentTemplate.CompanyID);
            parameters.Add("@TemplateName", lBS_SYS_DocumentTemplate.TemplateName);
            parameters.Add("@TemplateData", lBS_SYS_DocumentTemplate.TemplateData);
            parameters.Add("@CreatedBY", lBS_SYS_DocumentTemplate.CreatedBY);
            parameters.Add("@Action", ActionsForSP.Add.GetDescription());
            parameters.Add("@DocumentTemplateID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_DocumentTemplatesManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@DocumentTemplateID");
            return id;
        }
        public string UpdateDocumentTemplate(LBS_SYS_DocumentTemplate lBS_SYS_DocumentTemplate)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", lBS_SYS_DocumentTemplate.ID);
            parameters.Add("@CompanyID", lBS_SYS_DocumentTemplate.CompanyID);
            parameters.Add("@TemplateName", lBS_SYS_DocumentTemplate.TemplateName);
            parameters.Add("@TemplateData", lBS_SYS_DocumentTemplate.TemplateData);
            parameters.Add("@Action", ActionsForSP.Edit.GetDescription());
            parameters.Add("@DocumentTemplateID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_DocumentTemplatesManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@DocumentTemplateID");
            return id;
        }
        public IList<LBS_SYS_DocumentTemplate> GetAllDocumentTemplates(Guid CompanyID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", CompanyID);
            parameters.Add("@Action", ActionsForSP.SelectAll.GetDescription());
            var document = con.Query<LBS_SYS_DocumentTemplate>("SYS_DocumentTemplatesManagement", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return document;
        }

        public LBS_SYS_DocumentTemplate GetDocumentTemplateByID(Guid ID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", ID);
            parameters.Add("@Action", ActionsForSP.SelectBYID.GetDescription());
            var document = con.Query<LBS_SYS_DocumentTemplate>("SYS_DocumentTemplatesManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).FirstOrDefault();
            return document;
        }
        public bool DeleteDocumentTemplateByID(Guid ID, string DeletedBy)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@ID", ID);
            parameters.Add("@DeletedBy", DeletedBy);

            SqlMapper.Query(con, "SYS_DeleteDocumentTemplateByID",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);

            return true;
        }
        public IList<LBS_SYS_DocumentTemplate> GetDocumentByCompanyID(Guid CompanyID)
        {
            List<LBS_SYS_DocumentTemplate> lBS_SYS_Companies = new List<LBS_SYS_DocumentTemplate>();
            //var document = con.Query<LBS_SYS_DocumentTemplate>("SYS_GetDocumentByCompanyID",
            //                commandType: CommandType.StoredProcedure).AsList();
            //return document;
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", CompanyID);
            var document = con.Query<LBS_SYS_DocumentTemplate>("SYS_GetDocumentByCompanyID",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return document;
        }

        //public IList<ReportNames> GetReportNamesDocumentTemplate(Guid CompanyID)
        //{
        //    List<LBS_SYS_DocumentTemplate> lBS_SYS_Companies = new List<LBS_SYS_DocumentTemplate>();
        //    //var document = con.Query<LBS_SYS_DocumentTemplate>("SYS_GetDocumentByCompanyID",
        //    //                commandType: CommandType.StoredProcedure).AsList();
        //    //return document;
        //    DynamicParameters parameters = new DynamicParameters();
        //    parameters.Add("@CompanyID", CompanyID);
        //    var document = con.Query<LBS_SYS_DocumentTemplate>("SYS_GetDocumentByCompanyID",
        //                    param: parameters,
        //                    commandType: CommandType.StoredProcedure).AsList();
        //    return document;
        //}
    }
}

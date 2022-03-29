using Dapper;
using LinkERP.DAL.SYS.Interfaces;
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
    public class TaxCodeDetailsRepository :BaseRepository,ITaxCodeDetailsRepository
    {
        public string AddTaxCodeDetails(LBS_SYS_TaxCodeDetail lBS_SYS_TaxCodeDetail)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", lBS_SYS_TaxCodeDetail.CompanyID);
            parameters.Add("@TaxCodeID", lBS_SYS_TaxCodeDetail.TaxCodeID);
            parameters.Add("@TaxLabel", lBS_SYS_TaxCodeDetail.TaxLabel);
            parameters.Add("@TaxAmount", lBS_SYS_TaxCodeDetail.TaxAmount);
            parameters.Add("@Action", ActionsForSP.Add.GetDescription());
            parameters.Add("@CreatedBY", lBS_SYS_TaxCodeDetail.CreatedBY);
            parameters.Add("@TaxCodeDetailsID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_TaxCodeDetailsManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@TaxCodeDetailsID");
            return id;
        }
        public string UpdateTaxCodeDetails(LBS_SYS_TaxCodeDetail lBS_SYS_TaxCodeDetail)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", lBS_SYS_TaxCodeDetail.ID);
            parameters.Add("@CompanyID", lBS_SYS_TaxCodeDetail.CompanyID);
            parameters.Add("@TaxCodeID", lBS_SYS_TaxCodeDetail.TaxCodeID);
            parameters.Add("@TaxLabel", lBS_SYS_TaxCodeDetail.TaxLabel);
            parameters.Add("@TaxAmount", lBS_SYS_TaxCodeDetail.TaxAmount);
            parameters.Add("@CreatedBY", lBS_SYS_TaxCodeDetail.CreatedBY);
            parameters.Add("@Action", ActionsForSP.Edit.GetDescription());
            parameters.Add("@TaxCodeDetailsID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_TaxCodeDetailsManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@TaxCodeDetailsID");
            return id;
        }
        public IList<LBS_SYS_TaxCodeDetail> GetAllTaxCodeDetails()
        {
            List<LBS_SYS_TaxCodeDetail> lBS_SYS_taxcode = new List<LBS_SYS_TaxCodeDetail>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@Action", ActionsForSP.SelectAll.GetDescription());
            var taxCodeDetails = con.Query<LBS_SYS_TaxCodeDetail>("SYS_TaxCodeDetailsManagement", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return taxCodeDetails;
        }
     
        public LBS_SYS_TaxCodeDetail GetTaxCodeDetailsByID(Guid ID)
        {
            List<LBS_SYS_TaxCodeDetail> lBS_SYS_taxcode = new List<LBS_SYS_TaxCodeDetail>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", ID);
            parameters.Add("@Action", ActionsForSP.SelectBYID.GetDescription());
            var taxCodeDetails = con.Query<LBS_SYS_TaxCodeDetail>("SYS_TaxCodeDetailsManagement", param: parameters,
                            commandType: CommandType.StoredProcedure).FirstOrDefault();
            return taxCodeDetails;
        }
        public IList<LBS_SYS_TaxCodeDetail> GetTaxCodeDetailsByTaxCodeID(Guid ID)
        {
            List<LBS_SYS_TaxCodeDetail> lBS_SYS_taxcode = new List<LBS_SYS_TaxCodeDetail>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@Action", ActionsForSP.SelectBYRecID.GetDescription());
            parameters.Add("@RecID", ID);
            var taxCodeDetails = con.Query<LBS_SYS_TaxCodeDetail>("SYS_TaxCodeDetailsManagement", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return taxCodeDetails;
        }
        public string AddUpdateTaxcodeData(string lBS_SYS_TaxCodeDetail)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@TaxCodeDataJsonList", lBS_SYS_TaxCodeDetail);
            parameters.Add("@Action", "EditList");
            parameters.Add("@UpdateMsg", dbType: DbType.String, size: 150, direction: ParameterDirection.Output);
            SqlMapper.Query(con, "SYS_TaxCodeDetailsManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var UpdateMsg = parameters.Get<string>("@UpdateMsg");
            return UpdateMsg;
        }
    }
}

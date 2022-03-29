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
    public class TaxCodeRepository :BaseRepository,ITaxCodeRepository
    {
        public string AddTaxCode(LBS_SYS_TaxCode lBS_SYS_TaxCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", lBS_SYS_TaxCode.CompanyID);
            parameters.Add("@TaxCode", lBS_SYS_TaxCode.TaxCode);
            parameters.Add("@TaxCodeName", lBS_SYS_TaxCode.TaxCodeName);
            parameters.Add("@TaxInclusiveExclusiveFlag", lBS_SYS_TaxCode.TaxInclusiveExclusiveFlag);
            parameters.Add("@PercentageFlag", lBS_SYS_TaxCode.PercentageFlag);
            parameters.Add("@CreatedBY", lBS_SYS_TaxCode.CreatedBY);
            parameters.Add("@Action", ActionsForSP.Add.GetDescription());
            parameters.Add("@TaxCodeID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_TaxCodeManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@TaxCodeID");
            return id;
        }
        public string UpdateTaxCode(LBS_SYS_TaxCode lBS_SYS_TaxCode)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", lBS_SYS_TaxCode.ID);
            parameters.Add("@TaxCode", lBS_SYS_TaxCode.TaxCode);
            parameters.Add("@TaxCodeName", lBS_SYS_TaxCode.TaxCodeName);
            parameters.Add("@TaxInclusiveExclusiveFlag", lBS_SYS_TaxCode.TaxInclusiveExclusiveFlag);
            parameters.Add("@PercentageFlag", lBS_SYS_TaxCode.PercentageFlag);
            parameters.Add("@CreatedBY", lBS_SYS_TaxCode.CreatedBY);
            parameters.Add("@Action", ActionsForSP.Edit.GetDescription());
            parameters.Add("@TaxCodeID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_TaxCodeManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@TaxCodeID");
            return id;
        }
        //public IList<LBS_SYS_TaxCode> GetAllTaxCode()
        //{
        //    List<LBS_SYS_TaxCode> lBS_SYS_WorkFlow = new List<LBS_SYS_TaxCode>();

        //    var taxCode = con.Query<LBS_SYS_TaxCode>("SYS_TaxCode",
        //                    commandType: CommandType.StoredProcedure).AsList();
        //    return taxCode;
        //}

        public IList<LBS_SYS_TaxCode> GetAllTaxCode(Guid CompanyID)
        {
            List<LBS_SYS_TaxCode> lBS_SYS_taxcode = new List<LBS_SYS_TaxCode>();
            DynamicParameters parameters = new DynamicParameters();
            //parameters.Add("@RecID", null);
            parameters.Add("@CompanyID", CompanyID);
            parameters.Add("@Action", ActionsForSP.SelectAll.GetDescription());
            var taxCode = con.Query<LBS_SYS_TaxCode>("SYS_TaxCodeManagement", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return taxCode;
        }

        public LBS_SYS_TaxCode GetTaxCodeByID(Guid ID)
        {
            List<LBS_SYS_TaxCode> lBS_SYS_taxcode = new List<LBS_SYS_TaxCode>();
            DynamicParameters parameters = new DynamicParameters();
            // parameters.Add("@RecID", RecID);
            parameters.Add("@ID", ID);
            parameters.Add("@Action", ActionsForSP.SelectBYID.GetDescription());
            var taxCode = con.Query<LBS_SYS_TaxCode>("SYS_TaxCodeManagement", param: parameters,
                            commandType: CommandType.StoredProcedure).FirstOrDefault();
            return taxCode;
        }
        //public LBS_SYS_TaxCode GetTaxCodeByID(Guid ID)
        //{
        //    List<LBS_SYS_TaxCode> lBS_SYS_Companies = new List<LBS_SYS_TaxCode>();
        //    DynamicParameters parameters = new DynamicParameters();
        //    parameters.Add("@ID", ID);
        //    var taxCode = con.Query<LBS_SYS_TaxCode>("SYS_TaxCode",
        //                    param: parameters,
        //                    commandType: CommandType.StoredProcedure).FirstOrDefault();
        //    return taxCode;
        //}

    }
}

using Dapper;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using LinkERP.Entity.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace LinkERP.DAL.SYS
{
    public class CurrencyRepository : BaseRepository, ICurrencyRepository
    {
        public IList<LBS_SYS_Currency> GetCurrencies(Guid CompanyID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", CompanyID);
            parameters.Add("@Action", ActionsForSP.SelectAll.GetDescription());
            var companies = con.Query<LBS_SYS_Currency>("SYS_CurrencyManagement", param: parameters,
            commandType: CommandType.StoredProcedure).AsList();
            return companies;
        }
        public string AddCurrency(LBS_SYS_Currency lBS_SYS_Currency)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", lBS_SYS_Currency.CompanyID);
            parameters.Add("@CurrencyCode", lBS_SYS_Currency.CurrencyCode);
            parameters.Add("@CurrecnyName", lBS_SYS_Currency.CurrecnyName);
            parameters.Add("@DecimalPlaces", lBS_SYS_Currency.DecimalPlaces);
            parameters.Add("@CreatedBY", lBS_SYS_Currency.CreatedBY);
            parameters.Add("@Action", ActionsForSP.Add.GetDescription());
            parameters.Add("@CurrencyResponseID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_CurrencyManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@CurrencyResponseID");
            return id;
        }
        public string UpdateCurrency(LBS_SYS_Currency lBS_SYS_Currency)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", lBS_SYS_Currency.ID);
            parameters.Add("@CurrencyCode", lBS_SYS_Currency.CurrencyCode);
            parameters.Add("@CurrecnyName", lBS_SYS_Currency.CurrecnyName);
            parameters.Add("@DecimalPlaces", lBS_SYS_Currency.DecimalPlaces);
            parameters.Add("@Action", ActionsForSP.Edit.GetDescription());
            parameters.Add("@CurrencyResponseID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_CurrencyManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@CurrencyResponseID");
            return id;
        }
        public LBS_SYS_Currency GetCurrencyByID(Guid ID)
        {
            List<LBS_SYS_Currency> lBS_SYS_taxcode = new List<LBS_SYS_Currency>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", ID);
            parameters.Add("@Action", ActionsForSP.SelectBYID.GetDescription());
            var Details = con.Query<LBS_SYS_Currency>("SYS_CurrencyManagement", param: parameters,
                            commandType: CommandType.StoredProcedure).FirstOrDefault();
            return Details;
        }

        //Currency rates
        public IList<LBS_SYS_CurrencyRates> GetCurrencyRates()
        {
            List<LBS_SYS_CurrencyRates> lBS_SYS_CurrencyRates = new List<LBS_SYS_CurrencyRates>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@Action", ActionsForSP.SelectAll.GetDescription());
            var Details = con.Query<LBS_SYS_CurrencyRates>("[SYS_CurrencyRatesManagement]", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return Details;
        }
        public IList<LBS_SYS_CurrencyRates> GetCurrencyRatesExchange(Guid CurrencyID)
        {
            List<LBS_SYS_CurrencyRates> lBS_SYS_CurrencyRates = new List<LBS_SYS_CurrencyRates>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", CurrencyID);
            // parameters.Add("@Action", ActionsForSP.SelectAll.GetDescription());
            var Details = con.Query<LBS_SYS_CurrencyRates>("SYS_CurrencyExchangeRate", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return Details;
        }
        public string AddCurrencyRate(LBS_SYS_CurrencyRates lBS_SYS_CurrencyRates)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CurrencyID", lBS_SYS_CurrencyRates.CurrencyID);
            //parameters.Add("@LineNumber", lBS_SYS_CurrencyRates.LineNumber);
            parameters.Add("@EffectiveDate", lBS_SYS_CurrencyRates.EffectiveDate);
            parameters.Add("@DateEnd", lBS_SYS_CurrencyRates.DateEnd);
            parameters.Add("@TransactionRate", lBS_SYS_CurrencyRates.TransactionRate);
            parameters.Add("@CreatedBY", lBS_SYS_CurrencyRates.CreatedBY);
            parameters.Add("@Action", ActionsForSP.Add.GetDescription());
            parameters.Add("@CurrencyDetailsID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "[SYS_CurrencyRatesManagement]",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@CurrencyDetailsID");
            return id;
        }
        public string UpdateCurrencyRate(LBS_SYS_CurrencyRates lBS_SYS_CurrencyRates)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", lBS_SYS_CurrencyRates.ID);
            parameters.Add("@CurrencyID", lBS_SYS_CurrencyRates.CurrencyID);
            parameters.Add("@EffectiveDate", lBS_SYS_CurrencyRates.EffectiveDate);
            parameters.Add("@DateEnd", lBS_SYS_CurrencyRates.DateEnd);
            parameters.Add("@TransactionRate", lBS_SYS_CurrencyRates.TransactionRate);
            parameters.Add("@Action", ActionsForSP.Edit.GetDescription());
            parameters.Add("@CurrencyDetailsID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "[SYS_CurrencyRatesManagement]",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@CurrencyDetailsID");
            return id;
        }
        public LBS_SYS_CurrencyRates GetCurrencyRateByID(Guid ID)
        {
            List<LBS_SYS_CurrencyRates> lBS_SYS_taxcode = new List<LBS_SYS_CurrencyRates>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", ID);
            parameters.Add("@Action", ActionsForSP.SelectBYID.GetDescription());
            var taxCodeDetails = con.Query<LBS_SYS_CurrencyRates>("[SYS_CurrencyRatesManagement]", param: parameters,
                            commandType: CommandType.StoredProcedure).FirstOrDefault();
            return taxCodeDetails;
        }
    }
}

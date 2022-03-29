using Dapper;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace LinkERP.DAL.SYS
{
    public class CompanyRepository : BaseRepository, ICompanyRepository
    {
        public IList<LBS_SYS_Company> GetCompanies()
        {
            List<LBS_SYS_Company> lBS_SYS_Companies = new List<LBS_SYS_Company>();
            var companies = con.Query<LBS_SYS_Company>("SYS_GetCompanies",
                            commandType: CommandType.StoredProcedure).AsList();
            return companies;
        }

        public IList<LBS_SYS_Company> GetAllCompanies()
        {
            List<LBS_SYS_Company> lBS_SYS_Companies = new List<LBS_SYS_Company>();
            var companies = con.Query<LBS_SYS_Company>("SYS_GetAllCompanies",
                            commandType: CommandType.StoredProcedure).AsList();
            return companies;
        }
        public LBS_SYS_Company GetCompanyByID(Guid ID)
        {
            List<LBS_SYS_Company> lBS_SYS_Companies = new List<LBS_SYS_Company>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", ID);
            var companies = con.Query<LBS_SYS_Company>("SYS_GetCompanyByID",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).FirstOrDefault();
            return companies;
        }
        public string AddCompany(LBS_SYS_Company lBS_SYS_Company)
        {
            DynamicParameters parameters = new DynamicParameters();

            //parameters.Add("@ID", lBS_SYS_Company.ID);

            parameters.Add("@CompanyCode", lBS_SYS_Company.CompanyCode.Trim());
            parameters.Add("@Name", lBS_SYS_Company.Name);
            parameters.Add("@TradingName", lBS_SYS_Company.TradingName);
            parameters.Add("@Laddr1", lBS_SYS_Company.Laddr1);
            parameters.Add("@Laddr2", lBS_SYS_Company.Laddr2);
            parameters.Add("@Laddr3", lBS_SYS_Company.Laddr3);
            parameters.Add("@Paddr1", lBS_SYS_Company.Paddr1);
            parameters.Add("@Paddr2", lBS_SYS_Company.Paddr2);
            parameters.Add("@Paddr3", lBS_SYS_Company.Paddr3);
            parameters.Add("@Country", lBS_SYS_Company.Country);
            parameters.Add("@State", lBS_SYS_Company.State);
            parameters.Add("@City", lBS_SYS_Company.City);
            parameters.Add("@ZipCode", lBS_SYS_Company.ZipCode);
            parameters.Add("@TaxNumber", lBS_SYS_Company.TaxNumber);
            parameters.Add("@SuperannuationID", lBS_SYS_Company.SuperannuationID);
            parameters.Add("@DefaultPayrollRounding", lBS_SYS_Company.DefaultPayrollRounding);
            parameters.Add("@DefaultCurrency", lBS_SYS_Company.DefaultCurrency);
            if (lBS_SYS_Company.Logo != null)
                parameters.Add("@Logo", lBS_SYS_Company.Logo);
            parameters.Add("@Phone", lBS_SYS_Company.Phone);
            parameters.Add("@Fax", lBS_SYS_Company.Fax);
            parameters.Add("@EmailAddress", lBS_SYS_Company.EmailAddress);
            parameters.Add("@CreatedBY", lBS_SYS_Company.CreatedBY);
            parameters.Add("@CompanyID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_CompanyManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@CompanyID");
            return id;
        }
        public string UpdateCompany(LBS_SYS_Company lBS_SYS_Company)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@ID", lBS_SYS_Company.ID);
            parameters.Add("@CompanyCode", lBS_SYS_Company.CompanyCode);
            parameters.Add("@Name", lBS_SYS_Company.Name);
            parameters.Add("@TradingName", lBS_SYS_Company.TradingName);
            parameters.Add("@Laddr1", lBS_SYS_Company.Laddr1);
            parameters.Add("@Laddr2", lBS_SYS_Company.Laddr2);
            parameters.Add("@Laddr3", lBS_SYS_Company.Laddr3);
            parameters.Add("@Paddr1", lBS_SYS_Company.Paddr1);
            parameters.Add("@Paddr2", lBS_SYS_Company.Paddr2);
            parameters.Add("@Paddr3", lBS_SYS_Company.Paddr3);
            parameters.Add("@Country", lBS_SYS_Company.Country);
            parameters.Add("@State", lBS_SYS_Company.State);
            parameters.Add("@City", lBS_SYS_Company.City);
            parameters.Add("@ZipCode", lBS_SYS_Company.ZipCode);
            parameters.Add("@TaxNumber", lBS_SYS_Company.TaxNumber);
            parameters.Add("@SuperannuationID", lBS_SYS_Company.SuperannuationID);
            parameters.Add("@DefaultPayrollRounding", lBS_SYS_Company.DefaultPayrollRounding);
            parameters.Add("@DefaultCurrency", lBS_SYS_Company.DefaultCurrency);
            if (lBS_SYS_Company.Logo != null)
                parameters.Add("@Logo", lBS_SYS_Company.Logo);
            parameters.Add("@Phone", lBS_SYS_Company.Phone);
            parameters.Add("@Fax", lBS_SYS_Company.Fax);
            parameters.Add("@EmailAddress", lBS_SYS_Company.EmailAddress);
            parameters.Add("@CreatedBY", lBS_SYS_Company.CreatedBY);
            parameters.Add("@CompanyID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_CompanyManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@CompanyID");
            return id;
        }
        public bool DeleteCompanyByID(Guid ID, string DeletedBy)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@ID", ID);
            parameters.Add("@DeletedBy", DeletedBy);

            SqlMapper.Query(con, "SYS_DeleteCompanyByID",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);

            return true;
        }
    }
}

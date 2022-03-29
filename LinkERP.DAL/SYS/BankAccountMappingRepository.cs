using Dapper;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.DTO.SYS.BankAccountMapping;
using LinkERP.Entity.SYS;
using LinkERP.Entity.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace LinkERP.DAL.SYS
{
    public class BankAccountMappingRepository : BaseRepository, IBankAccountMappingRepository
    {
        public string AddBankAccountMapping(IList<LBS_SYS_BankAccountsMapping> lBS_SYS_bank)
        {
            string id = "";
            foreach (LBS_SYS_BankAccountsMapping lBS_SYS_BankAccountMappingAccess in lBS_SYS_bank)
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("@ID", lBS_SYS_BankAccountMappingAccess.ID);
                parameters.Add("@BankCodeFrom", lBS_SYS_BankAccountMappingAccess.BankCodeFrom);
                parameters.Add("@BankCodeTo", lBS_SYS_BankAccountMappingAccess.BankCodeTo);
                parameters.Add("@BankNumber", lBS_SYS_BankAccountMappingAccess.BankNumber);
                parameters.Add("@Deleted", lBS_SYS_BankAccountMappingAccess.Deleted);
                parameters.Add("@CreatedBY", lBS_SYS_BankAccountMappingAccess.CreatedBY);
                parameters.Add("@Action", ActionsForSP.Add.GetDescription());
                parameters.Add("@BankAccountID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);
                SqlMapper.Query(con, "SYS_BankAccountMappingManagement",
                                   param: parameters,
                                   commandType: CommandType.StoredProcedure);
                id += parameters.Get<string>("@BankAccountID") + ",";
                // var banks = con.Query<LBS_SYS_BankAccount>("prcAddOrUpdateBankAccount", param: parameters, commandType: CommandType.StoredProcedure).ToList();
            }
            return id;
        }



        public IList<LBS_SYS_BankAccountsMapping> GetAllBankAccountMapping(Guid CompanyID)
        {
            DynamicParameters parameters = new DynamicParameters();
            //List<LBS_SYS_Frequency> lBS_SYS_Frequency = new List<LBS_SYS_Frequency>();
            parameters.Add("@CompanyID", CompanyID);

            var bank = con.Query<LBS_SYS_BankAccountsMapping>("SYS_GetBankAccountMappingManagement", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return bank;
        }
        public IList<BankAccountsMapping> GetBankAccountMappingByBankID(Guid BankCodeFrom, Guid CompanyID)
        {
            DynamicParameters parameters = new DynamicParameters();
            //List<LBS_SYS_Frequency> lBS_SYS_Frequency = new List<LBS_SYS_Frequency>();
            parameters.Add("@BankCodeFrom", BankCodeFrom);
            parameters.Add("@CompanyID", CompanyID);

            var bank = con.Query<BankAccountsMapping>("SYS_GetBankAccountMappingManagement", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return bank;
        }
    }
}

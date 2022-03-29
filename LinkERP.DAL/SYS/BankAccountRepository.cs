using Dapper;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace LinkERP.DAL.SYS
{
    public class BankAccountRepository : BaseRepository, IBankAccountRepository
    {
        public IList<LBS_SYS_BankAccount> GetAllBankAccount()
        {
            //List<LBS_SYS_Frequency> lBS_SYS_Frequency = new List<LBS_SYS_Frequency>();

            var bank = con.Query<LBS_SYS_BankAccount>("SYS_BankAccount",
                            commandType: CommandType.StoredProcedure).AsList();
            return bank;
        }

        public string AddBankAccount(IList<LBS_SYS_BankAccount> lBS_SYS_bank)
        {
            string id = "";
            foreach (LBS_SYS_BankAccount lBS_SYS_BankAccountAccess in lBS_SYS_bank)
            {

                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("@AccountName", lBS_SYS_BankAccountAccess.AccountName);
                parameters.Add("@AccountNo", lBS_SYS_BankAccountAccess.AccountNo);
                parameters.Add("@RegistrationNo", lBS_SYS_BankAccountAccess.RegNo);
                parameters.Add("@ID", lBS_SYS_BankAccountAccess.ID);
                parameters.Add("@DefaultAccount", lBS_SYS_BankAccountAccess.DefaultAccount);
                parameters.Add("@CreatedBY", lBS_SYS_BankAccountAccess.CreatedBY);
                parameters.Add("@BankAccountID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);
                SqlMapper.Query(con, "SYS_AddOrUpdateBankAccount",
                                   param: parameters,
                                   commandType: CommandType.StoredProcedure);
                id += parameters.Get<string>("@BankAccountID") + ",";
                // var banks = con.Query<LBS_SYS_BankAccount>("prcAddOrUpdateBankAccount", param: parameters, commandType: CommandType.StoredProcedure).ToList();
            }
            return id;
        }

        public IList<LBS_SYS_BankAccount> GetBankAccountByBankID(Guid BankID)
        {
            List<LBS_SYS_BankAccount> lBS_SYS_Companies = new List<LBS_SYS_BankAccount>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@BankID", BankID);
            var Bankaccountdetails = con.Query<LBS_SYS_BankAccount>("SYS_BankAccountByBankID",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).ToList();
            return Bankaccountdetails;
        }
        public bool DeleteBankAccountByID(Guid BankID, string[] DeletedAccountNos, string DeletedBy)
        {
            // string id = "";
            foreach (string DeletedAccountNo in DeletedAccountNos)
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("@ID", BankID);
                parameters.Add("@AccountNo", DeletedAccountNo);
                parameters.Add("@DeletedBy", DeletedBy);

                SqlMapper.Query(con, "SYS_DeleteBankAccountByID",
                                param: parameters,
                                commandType: CommandType.StoredProcedure);
            }

            return true;
        }
        public IList<LBS_SYS_BankAccount> DeleteBankAccount(Guid ID, string AccountNo)
        {

            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", ID);
            parameters.Add("@AccountNo", AccountNo);
            var Bankaccountdetails = con.Query<LBS_SYS_BankAccount>("SYS_DeleteBankAccountManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).ToList();
            return Bankaccountdetails;
        }
    }
}

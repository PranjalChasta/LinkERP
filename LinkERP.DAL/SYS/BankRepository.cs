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
   public class BankRepository: BaseRepository, IBankRepository
    {
       
    
        public IList<LBS_SYS_Bank> GetAllBank(Guid CompanyID)
        {
            //List<LBS_SYS_Frequency> lBS_SYS_Frequency = new List<LBS_SYS_Frequency>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", CompanyID);
            parameters.Add("@Action", ActionsForSP.SelectAll.GetDescription());
            var bank = con.Query<LBS_SYS_Bank>("SYS_BankManagement", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return bank;
        }

        public string AddBank(LBS_SYS_Bank lBS_SYS_bank )
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", lBS_SYS_bank.CompanyID);
            parameters.Add("@BankCode", lBS_SYS_bank.BankCode);
            parameters.Add("@BankName", lBS_SYS_bank.BankName);
            parameters.Add("@CreatedBY", lBS_SYS_bank.CreatedBY);
            parameters.Add("@Action", ActionsForSP.Add.GetDescription());

            parameters.Add("@BankID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_BankManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@BankID");
            return id;
        }

        public string UpdateBank (LBS_SYS_Bank lBS_SYS_bank)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@ID", lBS_SYS_bank.ID);
            parameters.Add("@CompanyID", lBS_SYS_bank.CompanyID);
            parameters.Add("@BankCode", lBS_SYS_bank.BankCode);
            parameters.Add("@BankName", lBS_SYS_bank.BankName);
            parameters.Add("@Action", ActionsForSP.Edit.GetDescription());
            parameters.Add("@BankID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);
            SqlMapper.Query(con, "SYS_BankManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@BankID");
            return id;
        }

        public bool DeleteBankByID(Guid ID, string DeletedBy)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@ID", ID);
            parameters.Add("@DeletedBy", DeletedBy);

            SqlMapper.Query(con, "SYS_DeleteBankByID",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);

            return true;
        }

        public LBS_SYS_Bank GetBankByID(Guid ID)
        {
            List<LBS_SYS_Bank> lBS_SYS_Companies = new List<LBS_SYS_Bank>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", ID);
            parameters.Add("@Action", ActionsForSP.SelectBYID.GetDescription());
            var Bankdetails  = con.Query<LBS_SYS_Bank>("SYS_BankManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).FirstOrDefault();
            return Bankdetails;
        }


    }

}


using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS
{
    public class BankService : IBankService
    {
        IBankRepository bank;
       
        public BankService(IBankRepository _bank)
        {
            bank = _bank;           
        }


        public string AddBank(LBS_SYS_Bank lBS_SYS_bank)
        {
            return bank.AddBank(lBS_SYS_bank);
        }

        public bool DeleteBankByID(Guid ID, string DeletedBy)
        {
            return bank.DeleteBankByID(ID, DeletedBy);
        }

        public IList<LBS_SYS_Bank> GetAllBank(Guid CompanyID)
        {
            return bank.GetAllBank(CompanyID);
        }

        public LBS_SYS_Bank GetBankByID(Guid ID)
        {
            return bank.GetBankByID(ID);
        }

        public string UpdateBank(LBS_SYS_Bank lBS_SYS_bank)
        {
            return bank.UpdateBank(lBS_SYS_bank);
        }
    }
}


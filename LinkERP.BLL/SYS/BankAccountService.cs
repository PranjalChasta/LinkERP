using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS
{
   public class BankAccountService: IBankAccountService
    {
        IBankAccountRepository bank;
        public BankAccountService (IBankAccountRepository _bank)
        {
            bank = _bank;
        }

        public string AddBankAccount(IList<LBS_SYS_BankAccount> lBS_SYS_bank)
        {
            return bank.AddBankAccount(lBS_SYS_bank);
        }

        public IList<LBS_SYS_BankAccount> GetAllBankAccount()
        {
            return bank.GetAllBankAccount();
        }
        
        public IList<LBS_SYS_BankAccount> GetBankAccountByBankID (Guid BankID)
        {
            return bank.GetBankAccountByBankID(BankID);
        }
        public bool DeleteBankAccountByID(Guid BankID, string[] DeletedAccountNo, string DeletedBy)
        {
            return bank.DeleteBankAccountByID(BankID,DeletedAccountNo, DeletedBy);
        }
        public IList<LBS_SYS_BankAccount> DeleteBankAccount(Guid ID,string AccountNo)
        {
            return bank.DeleteBankAccount(ID, AccountNo);
        }

    }
}

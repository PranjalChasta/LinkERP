using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS.Interfaces
{
   public interface IBankAccountService
    {
        string AddBankAccount(IList<LBS_SYS_BankAccount> lBS_SYS_Bank);
        IList<LBS_SYS_BankAccount> GetBankAccountByBankID(Guid BankID);
        IList<LBS_SYS_BankAccount> GetAllBankAccount();
        bool DeleteBankAccountByID(Guid BankID,string[] DeletedAccountNo, string DeletedBy);
        IList<LBS_SYS_BankAccount> DeleteBankAccount(Guid ID, string AccountNo);

    }
}

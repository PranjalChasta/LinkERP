using LinkERP.DTO.SYS.BankAccountMapping;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SYS.Interfaces
{
   public interface IBankAccountMappingRepository
    {
        string AddBankAccountMapping(IList<LBS_SYS_BankAccountsMapping> lBS_SYS_BankMapping);
        IList<LBS_SYS_BankAccountsMapping> GetAllBankAccountMapping(Guid CompanyID);
        IList<BankAccountsMapping> GetBankAccountMappingByBankID(Guid BankCodeFrom, Guid CompanyID);
    }
}

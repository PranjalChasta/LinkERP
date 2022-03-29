using LinkERP.DTO.SYS.BankAccountMapping;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS.Interfaces
{
    public interface IBankAccountMappingService
    {
        string AddBankAccountMapping(IList<LBS_SYS_BankAccountsMapping> lBS_SYS_BankMapping);
        IList<LBS_SYS_BankAccountsMapping> GetAllBankAccountMapping(Guid CompanyID);
        IList<BankAccountsMapping> GetBankAccountMappingByBankID(Guid BankCodeFrom, Guid CompanyID);
    }
}

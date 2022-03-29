using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.DTO.SYS.BankAccountMapping;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS
{
    public class BankAccountMappingService : IBankAccountMappingService
    {
        IBankAccountMappingRepository bankAccountMappingRepository;
        public BankAccountMappingService(IBankAccountMappingRepository _bank)
        {
            bankAccountMappingRepository = _bank;
        }

        public string AddBankAccountMapping(IList<LBS_SYS_BankAccountsMapping> lBS_SYS_BankMapping)
        {
            return bankAccountMappingRepository.AddBankAccountMapping(lBS_SYS_BankMapping);
        }

        public IList<LBS_SYS_BankAccountsMapping> GetAllBankAccountMapping(Guid CompanyID)
        {
            return bankAccountMappingRepository.GetAllBankAccountMapping(CompanyID);
        }

        public IList<BankAccountsMapping> GetBankAccountMappingByBankID(Guid BankCodeFrom, Guid CompanyID)
        {
            return bankAccountMappingRepository.GetBankAccountMappingByBankID(BankCodeFrom, CompanyID);
        }
    }
}

using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SYS.Interfaces
{
   public interface IBankRepository
    {    
       
        string AddBank(LBS_SYS_Bank lBS_SYS_Bank);
        string UpdateBank(LBS_SYS_Bank lBS_SYS_Bank);
        IList<LBS_SYS_Bank> GetAllBank(Guid CompanyID);
        LBS_SYS_Bank GetBankByID(Guid ID);
        bool DeleteBankByID(Guid ID, string DeletedBy);
    }
}

using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SYS.Interfaces
{
    public interface IFrequencyRepository
    {
        
        string AddFrequency(LBS_SYS_Frequency lBS_SYS_Frequency);
        string UpdateFrequency(LBS_SYS_Frequency lBS_SYS_Frequency);
        IList<LBS_SYS_Frequency> GetFrequency(Guid CompanyID);
        LBS_SYS_Frequency GetFrequencyByID(Guid ID);
        bool DeleteFrequencyByID(Guid ID, string DeletedBy);
        IList<LBS_SYS_Frequency> GetFrequencyByCompanyID(Guid CompanyID);
    }
}

using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS
{
    public class FrequencyService: IFrequencyService
    {
         IFrequencyRepository frequency;
        public FrequencyService(IFrequencyRepository _frequency)
        {
            frequency = _frequency;
        }
        public IList<LBS_SYS_Frequency> GetFrequency(Guid CompanyID)
        {
            return frequency.GetFrequency(CompanyID);
        }

        public string AddFrequency(LBS_SYS_Frequency lBS_SYS_frequency)
        {
            return frequency.AddFrequency(lBS_SYS_frequency);
        }

        public bool DeleteFrequencyByID(Guid ID, string DeletedBy)
        {
            return frequency.DeleteFrequencyByID(ID, DeletedBy);
        }

        public LBS_SYS_Frequency GetFrequencyByID(Guid ID)
        {
            return frequency.GetFrequencyByID(ID);
        }

        public string UpdateFrequency (LBS_SYS_Frequency lBS_SYS_frequency )
        {
            return frequency.UpdateFrequency(lBS_SYS_frequency);
        }
        public IList<LBS_SYS_Frequency> GetFrequencyByCompanyID(Guid CompanyID)
        {
            return frequency.GetFrequencyByCompanyID(CompanyID);
        }

    }
}

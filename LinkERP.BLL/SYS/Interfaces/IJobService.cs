using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS.Interfaces
{
    public interface IJobService
    {
        string AddJob(LBS_SYS_Jobs lBS_SYS_Jobs);
        string UpdateJob(LBS_SYS_Jobs lBS_SYS_Jobs);
        IList<LBS_SYS_Jobs> GetJobs(Guid CompanyID);
        LBS_SYS_Jobs GetJobByID(Guid ID);
        bool DeleteJobByID(Guid ID, string DeletedBy);



    }
}

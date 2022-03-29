using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS
{
 public class JobService : IJobService
    {
        IJobRepository job;
        public JobService(IJobRepository _job)
        {
            job = _job;
        }

        public string AddJob(LBS_SYS_Jobs lBS_SYS_Jobs)
        {
            return job.AddJob(lBS_SYS_Jobs);
        }

        public bool DeleteJobByID(Guid ID, string DeletedBy)
        {
            return job.DeleteJobByID(ID, DeletedBy);
        }

        public IList<LBS_SYS_Jobs> GetJobs(Guid CompanyID)
        {
            return job.GetJobs(CompanyID);
        }

        public LBS_SYS_Jobs GetJobByID(Guid ID)
        {
            return job.GetJobByID(ID);
        }

        public string UpdateJob(LBS_SYS_Jobs lBS_SYS_Jobs)
        {
            return job.UpdateJob(lBS_SYS_Jobs);
        }

        
    }
}

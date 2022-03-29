using LinkERP.DAL.SYS.Interfaces;
using LinkERP.DTO.SYS.ReportSchedule;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SYS
{
    public class ReportScheduleService : IReportScheduleService
    {
        IReportScheduleRepository reportScheduleRepository;
        public ReportScheduleService(IReportScheduleRepository _reportScheduleRepository)
        {
            reportScheduleRepository = _reportScheduleRepository;
        }

        public Guid AddReportSchedule(LBS_SYS_ReportSchedule lBS_SYS_ReportSchedule)
        {
            return reportScheduleRepository.AddReportSchedule(lBS_SYS_ReportSchedule);
        }

        public IList<ReportSchedule> GetReportSchedules(Guid CompanyID)
        {
            return reportScheduleRepository.GetReportSchedules(CompanyID);
        }

        public void UpdateReportSchedule(LBS_SYS_ReportSchedule lBS_SYS_ReportSchedule)
        {
            reportScheduleRepository.UpdateReportSchedule(lBS_SYS_ReportSchedule);
        }
        public LBS_SYS_ReportSchedule GetReportsScheduleByID(Guid ID)
        {
            return reportScheduleRepository.GetReportsScheduleByID(ID);
        }
        public string  BackupDatabase(SYSUtility SYSUtility)
        {
            return reportScheduleRepository.BackupDatabase(SYSUtility);
        }

        
    }
}

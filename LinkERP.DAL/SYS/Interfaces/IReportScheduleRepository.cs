using LinkERP.DTO.SYS.ReportSchedule;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SYS.Interfaces
{
    public interface IReportScheduleRepository
    {
        IList<ReportSchedule> GetReportSchedules(Guid CompanyID);
        Guid AddReportSchedule(LBS_SYS_ReportSchedule lBS_SYS_ReportSchedule);
        string UpdateReportSchedule(LBS_SYS_ReportSchedule lBS_SYS_ReportSchedule);
        LBS_SYS_ReportSchedule GetReportsScheduleByID(Guid ID);
        string BackupDatabase(SYSUtility SYSUtility);
    }
}

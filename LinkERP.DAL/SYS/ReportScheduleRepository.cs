using Dapper;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.DTO.SYS.ReportSchedule;
using LinkERP.Entity.SYS;
using LinkERP.Entity.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;

namespace LinkERP.DAL.SYS
{
    public class ReportScheduleRepository : BaseRepository, IReportScheduleRepository
    {
        public IList<ReportSchedule> GetReportSchedules(Guid CompanyID)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@CompanyID", CompanyID);
            parameters.Add("@Action", "GetAllReportEmailSchedule");

            var data = con.Query<ReportSchedule>("SYS_ReportScheduleManagement",
                             param: parameters,
                             commandType: CommandType.StoredProcedure).AsList();

            return data;
        }

        public Guid AddReportSchedule(LBS_SYS_ReportSchedule lBS_SYS_ReportSchedule)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@CompanyID", lBS_SYS_ReportSchedule.CompanyID);
            parameters.Add("@FrequencyID", lBS_SYS_ReportSchedule.FrequencyID);
            parameters.Add("@ReportID", lBS_SYS_ReportSchedule.ReportID);
            parameters.Add("@Description", lBS_SYS_ReportSchedule.Description);
            parameters.Add("@Subject", lBS_SYS_ReportSchedule.Subject);
            parameters.Add("@EmailTo", lBS_SYS_ReportSchedule.EmailTo);
            parameters.Add("@EmailSendMode", lBS_SYS_ReportSchedule.EmailSendMode);
            parameters.Add("@LastRunDate", lBS_SYS_ReportSchedule.LastRunDate);
            parameters.Add("@NextRunDate", lBS_SYS_ReportSchedule.NextRunDate);
            parameters.Add("@EmailReportOption", lBS_SYS_ReportSchedule.EmailReportOption);
            parameters.Add("@ReportUser", lBS_SYS_ReportSchedule.ReportUser);
            parameters.Add("@DocumentTemplate", lBS_SYS_ReportSchedule.DocumentTemplate);
            parameters.Add("@DateFromType", lBS_SYS_ReportSchedule.DateFromType);
            parameters.Add("@DateToType", lBS_SYS_ReportSchedule.DateToType);
            parameters.Add("@OffsetFrom", lBS_SYS_ReportSchedule.OffSetDateFrom);
            parameters.Add("@OffsetTo", lBS_SYS_ReportSchedule.OffSetDateTo);
            parameters.Add("@CreatedBy", lBS_SYS_ReportSchedule.CreatedBY);

            parameters.Add("@ReportScheduleID", direction: ParameterDirection.Output, dbType: DbType.Guid);


            parameters.Add("@Action", "Add");

            SqlMapper.Query(con, "SYS_ReportScheduleManagement",
                             param: parameters,
                             commandType: CommandType.StoredProcedure);

            var ID = parameters.Get<Guid>("@ReportScheduleID");
            return ID;
        }

        public LBS_SYS_ReportSchedule GetReportScheduleByID(Guid ID)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@ID", ID);

            parameters.Add("@Action", "GetReportScheduleID");

            var reportSchedule = con.Query<LBS_SYS_ReportSchedule>("SYS_ReportScheduleManagement",
                               param: parameters,
                               commandType: CommandType.StoredProcedure).FirstOrDefault();

            return reportSchedule;
        }
        public LBS_SYS_ReportSchedule GetReportsScheduleByID(Guid ID)
        {         
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", ID);
            parameters.Add("@Action", ActionsForSP.SelectBYID.GetDescription());
            var reports = con.Query<LBS_SYS_ReportSchedule>("SYS_ReportScheduleManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).FirstOrDefault();
            return reports;
        }

        public string UpdateReportSchedule(LBS_SYS_ReportSchedule lBS_SYS_ReportSchedule)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@ID", lBS_SYS_ReportSchedule.ID);
            parameters.Add("@CompanyID", lBS_SYS_ReportSchedule.CompanyID);
            parameters.Add("@FrequencyID", lBS_SYS_ReportSchedule.FrequencyID);
            parameters.Add("@ReportID", lBS_SYS_ReportSchedule.ReportID);
            parameters.Add("@Description", lBS_SYS_ReportSchedule.Description);
            parameters.Add("@Subject", lBS_SYS_ReportSchedule.Subject);
            parameters.Add("@EmailTo", lBS_SYS_ReportSchedule.EmailTo);
            parameters.Add("@EmailSendMode", lBS_SYS_ReportSchedule.EmailSendMode);
            parameters.Add("@LastRunDate", lBS_SYS_ReportSchedule.LastRunDate);
            parameters.Add("@NextRunDate", lBS_SYS_ReportSchedule.NextRunDate);
            parameters.Add("@EmailReportOption", lBS_SYS_ReportSchedule.EmailReportOption);
            parameters.Add("@ReportUser", lBS_SYS_ReportSchedule.ReportUser);
            parameters.Add("@DocumentTemplate", lBS_SYS_ReportSchedule.DocumentTemplate);
            parameters.Add("@DateFromType", lBS_SYS_ReportSchedule.DateFromType);
            parameters.Add("@DateToType", lBS_SYS_ReportSchedule.DateToType);
            parameters.Add("@OffsetFrom", lBS_SYS_ReportSchedule.OffSetDateFrom);
            parameters.Add("@OffsetTo", lBS_SYS_ReportSchedule.OffSetDateTo);
            parameters.Add("@DocumentTemplate", lBS_SYS_ReportSchedule.DocumentTemplate);
            parameters.Add("@Action", "Update");           
            parameters.Add("@ReportScheduleID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);
            SqlMapper.Query(con, "SYS_ReportScheduleManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@ReportScheduleID");
            return id;
        }



        public string BackupDatabase(SYSUtility SYSUtility)
        {
            string exception = "";
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string DataBaseName = connection.Database;
               
                string bac = "E:\\ERPDBBackup\\TestErpDbLiveBackup";
                try
                {
                
                    if (!Directory.Exists(SYSUtility.Path))
                    {
                        Directory.CreateDirectory(SYSUtility.Path);
                    }
                    string FilePath = SYSUtility.Path +"\\"+ DataBaseName + DateTime.Now.ToString("yyyyMMddHHmmss") + ".bak";
                    string commandText = $@"BACKUP DATABASE [{DataBaseName}] TO DISK = N'{FilePath}' WITH NOFORMAT, INIT, NAME = N'{DataBaseName}-Full Database Backup', SKIP, NOREWIND, NOUNLOAD,  STATS = 10";
                    connection.Open();
                    using (SqlCommand command = connection.CreateCommand())
                    {

                        command.CommandText = commandText;

                        command.CommandType = CommandType.Text;
                        command.ExecuteNonQuery();
                        exception = "Successfull";
                    }
                }
                catch (Exception ex)
                {
                    exception = ex.ToString();
                }
               
              
            }
            return exception;

        }
    }
}

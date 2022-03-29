using Dapper;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity;
using LinkERP.Entity.GenericMaster;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace LinkERP.DAL.SYS
{
    public class TableDataRepository :BaseRepository,ITableDataRepository
    {
        public IList<LBS_SYS_TableData> GetAllTableData()
        {
            List<LBS_SYS_TableData> lBS_SYS_TableData = new List<LBS_SYS_TableData>();
            var tabledata = con.Query<LBS_SYS_TableData>("[prcGetAllTableData]",
                            commandType: CommandType.StoredProcedure).AsList();
            return tabledata;
        }
        public string AddTableData(LBS_SYS_TableData lBS_SYS_TableData)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID",lBS_SYS_TableData.CompanyID);
            parameters.Add("@TableID", lBS_SYS_TableData.TableID);
            parameters.Add("@ParentCodeID", lBS_SYS_TableData.ParentCodeID);
            parameters.Add("@DataCode", lBS_SYS_TableData.DataCode);
            parameters.Add("@DataName", lBS_SYS_TableData.DataName);
            parameters.Add("@CreatedBY", lBS_SYS_TableData.CreatedBY);
            parameters.Add("@TableDataID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "prcAddorUpdateTableData",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@TableDataID");
            return id;
        }
        public string UpdateTableData(LBS_SYS_TableData lBS_SYS_TableData)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", lBS_SYS_TableData.ID);
            parameters.Add("@CompanyID", lBS_SYS_TableData.CompanyID);
            parameters.Add("@TableID", lBS_SYS_TableData.TableID);
            parameters.Add("@DataCode", lBS_SYS_TableData.DataCode);
            parameters.Add("@DataName", lBS_SYS_TableData.DataName);
            parameters.Add("@ParentCodeID", lBS_SYS_TableData.ParentCodeID);
            parameters.Add("@CreatedBY", lBS_SYS_TableData.CreatedBY);
            parameters.Add("@TableDataID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);
            SqlMapper.Query(con, "prcAddorUpdateTableData",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@TableDataID");
            return id;
        }
        public LBS_SYS_TableData GetTableDataByID(Guid ID)
        {
            List<LBS_SYS_TableData> lBS_SYS_TableData = new List<LBS_SYS_TableData>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", ID);
            var tabledata = con.Query<LBS_SYS_TableData>("prcGetTableDataByID",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).FirstOrDefault();
            return tabledata;
        }
    }
}

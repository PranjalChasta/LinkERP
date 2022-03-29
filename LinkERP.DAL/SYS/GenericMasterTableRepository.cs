using Dapper;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity;
using LinkERP.Entity.GenericMaster;
using LinkERP.Entity.SYS;
using LinkERP.Entity.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace LinkERP.DAL.SYS
{
    public class GenericMasterTableRepository :BaseRepository,IGenericMasterTable
    {
        public IList<LBS_SYS_TableData> GetAllTableData(Guid CompanyID)
        {
            List<LBS_SYS_TableData> lBS_SYS_TableData = new List<LBS_SYS_TableData>();
            var tabledata = con.Query<LBS_SYS_TableData>("SYS_GetAllTableData",
                            commandType: CommandType.StoredProcedure).AsList();
            return tabledata;
        }

        public IList<LBS_SYS_Table> GetAllTables()
        {
             
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@Action", ActionsForSP.SelectAll.GetDescription());
            var tables = con.Query<LBS_SYS_Table>("SYS_GetAllTables", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return tables;
        }
        public LBS_SYS_TableData GetTableDataByTableDataID(Guid ID)
        {
             
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", ID);
            var tabledata = con.Query<LBS_SYS_TableData>("[SYS_GetTableDataByTableDataID]",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).FirstOrDefault();
            return tabledata;
        }
        public IList<LBS_SYS_TableData> GetDataByID(Guid ID, Guid CompanyID)
        {
            List<LBS_SYS_TableData> lBS_SYS_TableData = new List<LBS_SYS_TableData>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", ID);
            parameters.Add("@CompanyID", CompanyID);
            var tabledata = con.Query<LBS_SYS_TableData>("SYS_GetTableDataByTableID",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return tabledata;
        }
        public IList<LBS_SYS_TableData> GetPriceChangeReasonDataByID(Guid ID, Guid CompanyID)
        {
            List<LBS_SYS_TableData> lBS_SYS_TableData = new List<LBS_SYS_TableData>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", ID);
            parameters.Add("@CompanyID", CompanyID);
            parameters.Add("@Action", "GetPriceChangeReason");
            var tabledata = con.Query<LBS_SYS_TableData>("SYS_PriceChangeReason",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return tabledata;
        }
       
        public string AddTableData(LBS_SYS_TableData lBS_SYS_TableData)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@CompanyID", lBS_SYS_TableData.CompanyID);
            parameters.Add("@TableID", lBS_SYS_TableData.TableID);
            parameters.Add("@ParentCodeID", lBS_SYS_TableData.ParentCodeID);
            parameters.Add("@DataCode", lBS_SYS_TableData.DataCode);
            parameters.Add("@DataName", lBS_SYS_TableData.DataName);
            parameters.Add("@CreatedBY", lBS_SYS_TableData.CreatedBY);
            parameters.Add("@TableDataID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_TableDataManagement",
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
            parameters.Add("@ParentCodeID", lBS_SYS_TableData.ParentCodeID);
            parameters.Add("@DataCode", lBS_SYS_TableData.DataCode);
            parameters.Add("@DataName", lBS_SYS_TableData.DataName);
            parameters.Add("@CreatedBY", lBS_SYS_TableData.CreatedBY);
            parameters.Add("@TableDataID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_TableDataManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@TableDataID");
            return id;
        }
        public IList<LBS_SYS_Table> GetAllModulesTables(string Module)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@Action", ActionsForSP.SelectBYID.GetDescription());
            parameters.Add("@Module", Module);
            var tables = con.Query<LBS_SYS_Table>("SYS_GetAllTables", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return tables;
        }

        public IList<LBS_SYS_TableData> GetChildLookup(Guid TableCode, Guid ParentCode)
        {
            List<LBS_SYS_TableData> lBS_SYS_Companies = new List<LBS_SYS_TableData>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@TableCode", TableCode);
            parameters.Add("@ParentCode", ParentCode);
            parameters.Add("@Action", "GetChildLookup");
            var Notes = con.Query<LBS_SYS_TableData>("SYS_GetAllTableData",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return Notes;
        }
        public string AddUpdateParentData(string lBS_SYS_TableData)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@TableDataJsonList", lBS_SYS_TableData);
            parameters.Add("@Action", "EditList");
            parameters.Add("@UpdateMsg", dbType: DbType.String, size: 150, direction: ParameterDirection.Output); 
            SqlMapper.Query(con, "SYS_GetAllTableData",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var UpdateMsg = parameters.Get<string>("@UpdateMsg");
            return UpdateMsg;
        }
    }
}

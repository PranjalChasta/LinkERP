using Dapper;
using LinkERP.DAL.SHARED.Interfaces;
using LinkERP.Entity.GenericMaster;
using LinkERP.Entity.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace LinkERP.DAL.SHARED
{
   public class GenricTablesLookupRepository:BaseRepository, IGenricTablesLookupRepository
    {
        public IList<LBS_SYS_TableData> GetLookup()
        {
            List<LBS_SYS_TableData> lBS_SYS_TableData = new List<LBS_SYS_TableData>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@Action", ActionsForSP.SelectAll.GetDescription()); 
            var tables = con.Query<LBS_SYS_TableData>("SYS_GetAllTableData",
                            commandType: CommandType.StoredProcedure).AsList();
            return tables;
        }
        public IList<LBS_SYS_TableData> GetLookupByID(Guid TableCode,Guid CompanyID)
        {
            List<LBS_SYS_TableData> lBS_SYS_Companies = new List<LBS_SYS_TableData>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@TableCode", TableCode);
            parameters.Add("@CompanyID", CompanyID);
            parameters.Add("@Action", "ParentLookup");
            var Notes = con.Query<LBS_SYS_TableData>("SYS_GetAllTableData",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return Notes;
        } 
        public IList<LBS_SYS_TableData> GetChildLookup(Guid TableCode, Guid ParentCode,Guid CompanyID)
        {
            List<LBS_SYS_TableData> lBS_SYS_Companies = new List<LBS_SYS_TableData>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@TableCode", TableCode);
            parameters.Add("@CompanyID", CompanyID);
            parameters.Add("@ParentCode", ParentCode);
            parameters.Add("@Action", "ChildLookup");
            var Notes = con.Query<LBS_SYS_TableData>("SYS_GetAllTableData",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return Notes;
        }
    }
}

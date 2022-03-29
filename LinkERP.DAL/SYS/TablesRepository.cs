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
    public class TablesRepository :BaseRepository,ITablesRepository
    {
        public IList<LBS_SYS_Table> GetAllTables()
        {
            List<LBS_SYS_Table> lBS_SYS_TableData = new List<LBS_SYS_Table>();
            var tables = con.Query<LBS_SYS_Table>("[prcGetAllTables]",
                            commandType: CommandType.StoredProcedure).AsList();
            return tables;
        }
        public LBS_SYS_Table GetTablesByID(Guid ID)
        {
            List<LBS_SYS_Table> lBS_SYS_TableData = new List<LBS_SYS_Table>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", ID);
            var tables = con.Query<LBS_SYS_Table>("prcGetTablesByID",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).FirstOrDefault();
            return tables;
        }
    }
}

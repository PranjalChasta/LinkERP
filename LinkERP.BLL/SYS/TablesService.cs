using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.GenericMaster;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS
{
    public class TablesService :ITablesService
    {
        ITablesRepository tables;
        public TablesService(ITablesRepository _tablesRepository)
        {
            tables = _tablesRepository;
        }
        public IList<LBS_SYS_Table> GetAllTables()
        {
            return tables.GetAllTables();
        }
        public LBS_SYS_Table GetTablesByID(Guid ID)
        {
            return tables.GetTablesByID(ID);
        }
    }
}

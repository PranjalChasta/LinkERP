using LinkERP.Entity.GenericMaster;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS.Interfaces
{
    public interface ITablesService
    {
        IList<LBS_SYS_Table> GetAllTables();
        LBS_SYS_Table GetTablesByID(Guid ID);
    }
}

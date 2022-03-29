using LinkERP.Entity.GenericMaster;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SYS.Interfaces
{
    public interface ITablesRepository
    {
        IList<LBS_SYS_Table> GetAllTables();
        LBS_SYS_Table GetTablesByID(Guid ID);
    }
}

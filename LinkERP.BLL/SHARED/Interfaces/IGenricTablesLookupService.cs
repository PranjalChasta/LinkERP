using LinkERP.Entity.GenericMaster;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SHARED.Interfaces
{
    public interface IGenricTablesLookupService
    {
        IList<LBS_SYS_TableData> GetLookup(); 
        IList<LBS_SYS_TableData> GetLookupByID(Guid TableCode,Guid CompanyID);

        IList<LBS_SYS_TableData> GetChildLookup(Guid TableCode, Guid ParentCode,Guid CompanyID);
    }
}

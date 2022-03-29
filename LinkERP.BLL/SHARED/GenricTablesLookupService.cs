using LinkERP.BLL.SHARED.Interfaces;
using LinkERP.DAL.SHARED.Interfaces;
using LinkERP.Entity.GenericMaster;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SHARED
{
    public class GenricTablesLookupService : IGenricTablesLookupService
    {
        IGenricTablesLookupRepository tabledata;
        public GenricTablesLookupService(IGenricTablesLookupRepository _tabledata)
        {
            tabledata = _tabledata;
        }
        public IList<LBS_SYS_TableData> GetLookup()
        {
            return tabledata.GetLookup();
        }
        public IList<LBS_SYS_TableData> GetLookupByID(Guid TableCode, Guid CompanyID)
        {
            return tabledata.GetLookupByID(TableCode, CompanyID);
        }

        public IList<LBS_SYS_TableData> GetChildLookup(Guid TableCode, Guid ParentCode,Guid CompanyID)
        {
            return tabledata.GetChildLookup(TableCode, ParentCode, CompanyID);
        }
    }
}

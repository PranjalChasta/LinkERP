using LinkERP.Entity.GenericMaster;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS.Interfaces
{
    public interface IGenericMasterTableService
    {
        IList<LBS_SYS_TableData> GetAllTableData(Guid CompanyID);
        IList<LBS_SYS_Table> GetAllTables();
        LBS_SYS_TableData GetTableDataByTableDataID(Guid ID);
        IList<LBS_SYS_TableData> GetDataByID(Guid ID, Guid CompanyID);
        IList<LBS_SYS_TableData> GetPriceChangeReasonDataByID(Guid ID, Guid CompanyID);
        
        string AddTableData(LBS_SYS_TableData lBS_SYS_TableData);
        string UpdateTableData(LBS_SYS_TableData lBS_SYS_TableData);
        IList<LBS_SYS_Table> GetAllModulesTables(string Module);
        IList<LBS_SYS_TableData> GetChildLookup(Guid TableCode, Guid ParentCode);
        string AddUpdateParentData(string lBS_SYS_TableData);
    }
}

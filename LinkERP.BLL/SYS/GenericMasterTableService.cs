using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.GenericMaster;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS
{
    public class GenericMasterTableService :IGenericMasterTableService
    {
        IGenericMasterTable  tabledata;
        public GenericMasterTableService(IGenericMasterTable _tabledata)
        {
            tabledata = _tabledata;
        }
        public IList<LBS_SYS_TableData> GetAllTableData(Guid CompanyID)
        {
            return tabledata.GetAllTableData(CompanyID);
        }
        public IList<LBS_SYS_Table> GetAllTables()
        {
            return tabledata.GetAllTables();
        }
        public LBS_SYS_TableData GetTableDataByTableDataID(Guid ID)
        {
            return tabledata.GetTableDataByTableDataID(ID);
        }
        public IList<LBS_SYS_TableData>GetDataByID(Guid ID, Guid CompanyID)
        {
            return tabledata.GetDataByID(ID,CompanyID);
        }
        public IList<LBS_SYS_TableData> GetPriceChangeReasonDataByID(Guid ID, Guid CompanyID)
        {
            return tabledata.GetPriceChangeReasonDataByID(ID, CompanyID);
        }
      
        public string AddTableData(LBS_SYS_TableData lBS_SYS_TableData)
        {
            return tabledata.AddTableData(lBS_SYS_TableData);
        }
        public string UpdateTableData(LBS_SYS_TableData lBS_SYS_TableData)
        {
            return tabledata.UpdateTableData(lBS_SYS_TableData);
        }

        public IList<LBS_SYS_Table> GetAllModulesTables(string Module)
        {
            return tabledata.GetAllModulesTables(Module);
        }

        public IList<LBS_SYS_TableData> GetChildLookup(Guid TableCode, Guid ParentCode)
        {
            return tabledata.GetChildLookup(TableCode,ParentCode);
        }
        public string AddUpdateParentData(string lBS_SYS_TableData)
        {
            return tabledata.AddUpdateParentData(lBS_SYS_TableData);
        }
        
    }
}

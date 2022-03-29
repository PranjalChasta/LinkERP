using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.GenericMaster;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS
{
    public class TableDataService :ITableDataService
    {
        ITableDataRepository tabledata;
        public TableDataService(ITableDataRepository _tableDataRepository)
        {
            tabledata = _tableDataRepository;
        }
        public IList<LBS_SYS_TableData> GetAllTableData()
        {
            return tabledata.GetAllTableData();
        }
        public string AddTableData(LBS_SYS_TableData lBS_SYS_TableData)
        {
            return tabledata.AddTableData(lBS_SYS_TableData);
        }
        public string UpdateTableData(LBS_SYS_TableData lBS_SYS_TableData)
        {
            return tabledata.UpdateTableData(lBS_SYS_TableData);
        }
        public LBS_SYS_TableData GetTableDataByID(Guid ID)
        {
            return tabledata.GetTableDataByID(ID);
        }
    }
}

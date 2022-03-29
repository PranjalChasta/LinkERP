﻿using LinkERP.Entity.GenericMaster;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SYS.Interfaces
{
    public interface ITableDataRepository
    {
        IList<LBS_SYS_TableData> GetAllTableData();
        string AddTableData(LBS_SYS_TableData lBS_SYS_TableData);
        string UpdateTableData(LBS_SYS_TableData lBS_SYS_TableData);
        LBS_SYS_TableData GetTableDataByID(Guid ID);
    }
}

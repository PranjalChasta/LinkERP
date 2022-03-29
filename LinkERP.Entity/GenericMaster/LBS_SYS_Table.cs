using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.GenericMaster
{
    public class LBS_SYS_Table :BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string TableCode { get; set; }
        public string TableName { get; set; }
        public LBS_SYS_TableData LBS_SYS_TableData { get; set; }
        public string DataCode { get; set; }
        public string DataName { get; set; }
        public bool IsChild { get; set; }
    }
}

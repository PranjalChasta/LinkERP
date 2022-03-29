using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.GenericMaster
{
    public class LBS_SYS_TableData :BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string TableID { get; set; }
        public string ParentCodeID { get; set; }
        public string DataCode { get; set; }
        public string DataName { get; set; }
        public LBS_SYS_Table LBS_SYS_Table { get; set; }
        
    }

}

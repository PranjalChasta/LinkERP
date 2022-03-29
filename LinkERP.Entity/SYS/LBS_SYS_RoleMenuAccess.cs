using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
    public class LBS_SYS_RoleMenuAccess : BaseEntity
    {
        public Guid RoleID { get; set; }       
        public string MenuID { get; set; }
        public bool ReadAccess { get; set; }
        public bool WriteAccess { get; set; }
        public bool DeleteAccess { get; set; }
        public bool AllAccess { get; set; }
        public bool NoAccess { get; set; }
        public LBS_SYS_Menu LBS_SYS_Menu { get; set; }
        public LBS_SYS_Role LBS_SYS_Role { get; set; }
    }
}

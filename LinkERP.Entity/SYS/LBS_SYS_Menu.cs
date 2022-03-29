using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
    public class LBS_SYS_Menu
    {
        public string ModuleID { get; set; }
        public string MenuId { get; set; }
        public string MenuName { get; set; }
        public string ParentMenuID { get; set; }
        public LBS_SYS_Module LBS_SYS_Module { get; set; }
    }
}

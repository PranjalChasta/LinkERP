using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
  public  class LBS_SYS_RoleModuleAccess //:BaseEntity
    {
        public string ID { get; set; }
        public Guid RoleId { get; set; }
        public string ModuleID { get; set; }
        public LBS_SYS_Module LBS_SYS_Module { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SHARED
{
    public class MenuPermissions
    {
        public string MenuID { get; set; }
        public string MenuName { get; set; }
        public string ModuleID { get; set; }
        public string Path { get; set; }
        public bool Read_Access { get; set; }
        public bool Write_Access { get; set; }
        public bool Delete_Access { get; set; }
        public bool All_Access { get; set; } 
        public bool isVisible { get; set; } 
    }

    public class ModulePermissions
    {
        public string ModuleID { get; set; }
    }

    public class AccessPermissions
    {
        public object MenuPermissions { get; set; }
        public object ModulePermissions { get; set; }
        public object CompaniesPermissions { get; set; } 
        public object WarehousesPermissions { get; set; }
        public string Message { get; set; }
        public bool IsSuccess { get; set; }
    }
    
}
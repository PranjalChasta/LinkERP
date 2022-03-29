using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS
{
   public  class ModuleService: IModuleService
    {
        IModuleRepository module;
        public ModuleService(IModuleRepository _module)
        {
            module = _module;
        }
        public IList<LBS_SYS_Module> GetModules()
        {
            return module.GetModules();
        }
        public IList<LBS_SYS_Module> GetModuleNotExistInRoleID(string ID)
        {
            return module.GetModuleNotExistInRoleID(ID);
        }
    }
}

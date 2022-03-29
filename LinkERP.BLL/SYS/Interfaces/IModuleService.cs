using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS.Interfaces
{
    public interface IModuleService
    {
        IList<LBS_SYS_Module> GetModules();

        IList<LBS_SYS_Module> GetModuleNotExistInRoleID(string ID);
    }
}

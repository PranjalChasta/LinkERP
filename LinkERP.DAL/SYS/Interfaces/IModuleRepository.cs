using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SYS.Interfaces
{
    public interface IModuleRepository
    {
        IList<LBS_SYS_Module> GetModules();
        IList<LBS_SYS_Module> GetModuleNotExistInRoleID(string ID);
    }
}

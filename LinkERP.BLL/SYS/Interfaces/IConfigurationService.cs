using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS.Interfaces
{
    public interface IConfigurationService
    {
        string AddConfiguration(LBS_SYS_Configuration lBS_SYS_Configuration);
        string UpdateConfiguration(LBS_SYS_Configuration lBS_SYS_Configuration);
        IList<LBS_SYS_Configuration> GetAllConfigurations(Guid CompanyID);
        LBS_SYS_Configuration GetConfigurationByID(Guid ID);
        IList<LBS_SYS_Configuration> GetAllConfigurationByIDs(Guid CompanyID, string ModuleId);
        string UpdateConfigurationData(string LBS_SYS_Configuration);
        IList<LBS_SYS_Configuration> GetDefaultConfiguration(Guid CompanyID, string ModuleId);
    }
}

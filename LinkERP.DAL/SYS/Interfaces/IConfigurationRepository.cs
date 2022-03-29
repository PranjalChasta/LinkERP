using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SYS.Interfaces
{
    public interface IConfigurationRepository
    {
        string AddConfiguration(LBS_SYS_Configuration lBS_SYS_Configuration);
        string UpdateConfiguration(LBS_SYS_Configuration lBS_SYS_Configuration);
        IList<LBS_SYS_Configuration> GetAllConfigurations(Guid CompanyID);
        LBS_SYS_Configuration GetConfigurationByID(Guid ID);
        IList<LBS_SYS_Configuration> GetAllConfigurationByIDs(Guid CompanyID, string ModuleId);
        string UpdateConfigurationData(string LBS_SYS_Configuration);
        LBS_SYS_Configuration GetConfigurationByFlag(Guid CompanyID, string Flag);
        IList<LBS_SYS_Configuration> GetDefaultConfiguration(Guid CompanyID, string ModuleId);
    }
}

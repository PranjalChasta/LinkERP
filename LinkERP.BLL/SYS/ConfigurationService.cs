using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS
{
    public class ConfigurationService :IConfigurationService
    {
        IConfigurationRepository configurationRepository;
        public ConfigurationService(IConfigurationRepository _configurationRepository)
        {
            configurationRepository = _configurationRepository;
        }
        public string AddConfiguration(LBS_SYS_Configuration lBS_SYS_Configuration)
        {
            return configurationRepository.AddConfiguration(lBS_SYS_Configuration);
        }
        public string UpdateConfiguration(LBS_SYS_Configuration lBS_SYS_Configuration)
        {
            return configurationRepository.UpdateConfiguration(lBS_SYS_Configuration);
        }
        public IList<LBS_SYS_Configuration> GetAllConfigurations(Guid CompanyID)
        {
            return configurationRepository.GetAllConfigurations(CompanyID);
        }
        public LBS_SYS_Configuration GetConfigurationByID(Guid ID)
        {
            return configurationRepository.GetConfigurationByID(ID);
        }
        public IList<LBS_SYS_Configuration> GetAllConfigurationByIDs(Guid CompanyID, string ModuleId)
        {
            return configurationRepository.GetAllConfigurationByIDs(CompanyID, ModuleId);
        }
        public string UpdateConfigurationData(string LBS_SYS_Configuration)
        {
            return configurationRepository.UpdateConfigurationData(LBS_SYS_Configuration);
        }
        public IList<LBS_SYS_Configuration> GetDefaultConfiguration(Guid CompanyID, string ModuleId)
        {
            return configurationRepository.GetDefaultConfiguration(CompanyID, ModuleId);
        }
    }
}


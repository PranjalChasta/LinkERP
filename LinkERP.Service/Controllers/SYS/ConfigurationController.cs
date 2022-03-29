using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LinkERP.BLL.SYS.Interfaces;
using LinkERP.Entity;
using LinkERP.Entity.SYS;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace LinkERP.Service.Controllers.SYS
{
    [Route("api/SYS/[controller]")]
    [ApiController]
    public class ConfigurationController : BaseController
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private IConfigurationService configurationService;
        public ConfigurationController(
            ILogger<IConfigurationService> _logger, IConfigurationService _configurationService, 
            IConfiguration _iconfiguration, 
            IHostingEnvironment _hostingEnvironment)
        {
            configurationService = _configurationService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }
        // Add Records into LBS_SYS_Configuration table.
        [HttpPost("[action]")]
        public IActionResult AddConfiguration([FromBody]LBS_SYS_Configuration lBS_SYS_Configuration)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding Configuration to storage");
                var data = configurationService.AddConfiguration(lBS_SYS_Configuration);

                response.Data = new
                {
                    id = data
                };
                response.IsSuccess = true;
                response.Message = "Configuration added successfully";
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Error: " + ex.Message;
                logger.LogError($"Error: {ex.Message}");
                return BadRequest(response);
            }
        }
        // Update Records into LBS_SYS_Configuration table.
        [HttpPost("[action]")]
        public IActionResult UpdateConfiguration([FromBody]LBS_SYS_Configuration lBS_SYS_Configuration)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Updating the Configuration to storage");
                var data = configurationService.UpdateConfiguration(lBS_SYS_Configuration);

                response.Data = new
                {
                    id = data
                };
                response.IsSuccess = true;
                response.Message = "Configuration updated successfully";
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Error: " + ex.Message;
                logger.LogError($"Error: {ex.Message}");
                return BadRequest(response);
            }
        }
        // To Fetch All Records from LBS_SYS_Configuration table.
        [HttpGet("[action]")]
        public IActionResult GetAllConfigurations()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Configuration data");
                var data = configurationService.GetAllConfigurations(CompanyID);

                response.Data = new
                {
                    configuration = data
                };
                response.IsSuccess = true;
                response.Message = data == null ? "Record(s) not found" : "";
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Error: " + ex.Message;
                logger.LogError($"Error: {ex.Message}");
                return BadRequest(response);
            }
        }
        // To Fetch Records from LBS_SYS_Configuration table By ID.
        [HttpGet("[action]/{ID}")]
        public IActionResult GetConfigurationByID(Guid ID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Configuration data by ID from storage");
                var data = configurationService.GetConfigurationByID(ID);

                response.Data = new
                {
                    configuration = data
                };
                response.IsSuccess = true;
                response.Message = data == null ? "Record(s) not found" : "";
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Error: " + ex.Message;
                logger.LogError($"Error: {ex.Message}");
                return BadRequest(response);
            }
        }
        // To Fetch All Records from LBS_SYS_Configuration table.
        [HttpGet("[action]/{ModuleId}")]
        public IActionResult GetAllConfigurationByIDs(string ModuleId)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Configuration data by moduleId");
                var data = configurationService.GetAllConfigurationByIDs(CompanyID, ModuleId);

                response.Data = new
                {
                    configurationbyIds = data
                };
                response.IsSuccess = true;
                response.Message = data == null ? "Record(s) not found" : "";
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Error: " + ex.Message;
                logger.LogError($"Error: {ex.Message}");
                return BadRequest(response);
            }
        }
        [HttpPost("[action]")]
        public IActionResult UpdateConfigurations([FromBody] IList<LBS_SYS_Configuration> lBS_SYS_Configuration)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding WorkFlow to storage");
                var UpdateMsg = configurationService.UpdateConfigurationData(JsonConvert.SerializeObject(lBS_SYS_Configuration));
                response.Data = new
                {
                    id = UpdateMsg
                };
                if (UpdateMsg == "Success")
                {
                    response.IsSuccess = true;
                    response.Message = "Configuration Data added successfully";
                }
                else
                {
                    response.IsSuccess = false;
                    response.Message = UpdateMsg;
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Error: " + ex.Message;
                logger.LogError($"Error: {ex.Message}");
                return BadRequest(response);
            }

        }
        [HttpGet("[action]/{ModuleId}")]
        public IActionResult GetDefaultConfiguration(string ModuleId)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Configuration data by moduleId");
                var data = configurationService.GetDefaultConfiguration(CompanyID, ModuleId);

                response.Data = new
                {
                    configurationbyIds = data
                };
                response.IsSuccess = true;
                response.Message = data == null ? "Record(s) not found" : "";
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Error: " + ex.Message;
                logger.LogError($"Error: {ex.Message}");
                return BadRequest(response);
            }
        }
    }
}

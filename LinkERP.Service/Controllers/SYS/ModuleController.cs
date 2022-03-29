using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LinkERP.BLL.SYS.Interfaces;
using LinkERP.Entity;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LinkERP.Service.Controllers.SYS
{
    [Route("api/SYS/[controller]")]
    [ApiController]
    public class ModuleController : ControllerBase
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private IModuleService moduleService;
        public ModuleController(ILogger<IModuleService> _logger, IModuleService _moduleService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            moduleService = _moduleService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }


        [HttpGet("[action]")]
        public IActionResult GetModules()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Modules data");
                var data = moduleService.GetModules();

                response.Data = new
                {
                    modules = data
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
        [HttpGet("[action]/{ID}")]
       
        public IActionResult GetModuleNotExistInRoleID(string ID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Modules data");
                var data = moduleService.GetModuleNotExistInRoleID(ID);

                response.Data = new
                {
                    modules = data
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
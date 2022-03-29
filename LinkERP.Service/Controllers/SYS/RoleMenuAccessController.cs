using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LinkERP.BLL.SYS.Interfaces;
using LinkERP.Entity;
using LinkERP.Entity.SYS;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LinkERP.Service.Controllers.SYS
{
    [Route("api/SYS/[controller]")]
    [ApiController]
    public class RoleMenuAccessController : ControllerBase
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private IRoleMenuAccessService roleMenuAccessService;

        public RoleMenuAccessController(ILogger<ICompanyService> _logger, IRoleMenuAccessService _roleMenuAccessService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            roleMenuAccessService = _roleMenuAccessService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }

        [HttpGet("[action]/{RoleID}/{ModuleID}")]
        public IActionResult GetRoleMenuAccessByRoleAndModule(Guid RoleID, string ModuleID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Role menu access details");
                var data = roleMenuAccessService.GetRoleMenuAccessByRoleAndModule(RoleID, ModuleID);

                response.Data = new
                {
                    roleMenuAccess = data
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

        [HttpGet("[action]/{RoleID}")]
        public IActionResult GetRoleMenuAccessByRole(Guid RoleID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Role menu access details");
                var data = roleMenuAccessService.GetRoleMenuAccessByRole(RoleID);

                response.Data = new
                {
                    roleMenuAccess = data
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
        public IActionResult AddUpdateRoleMenuAccess([FromBody] IList<LBS_SYS_RoleMenuAccess> lstLBS_SYS_RoleMenuAccess)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding Role menu access details");
                var data = roleMenuAccessService.AddUpdateRoleMenuAccess(lstLBS_SYS_RoleMenuAccess);

                response.Data = data;
                response.IsSuccess = true;
                response.Message = "Role Menu Access saved successfully";
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
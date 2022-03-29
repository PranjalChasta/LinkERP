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
    public class RoleModuleAccessController : ControllerBase
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private IRoleModuleAccessService roleService;
        public RoleModuleAccessController(ILogger<IRoleModuleAccessService> _logger, IRoleModuleAccessService _roleService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            roleService = _roleService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }

        // To Fetch All Records from LBS_SYS_RoleModuleAccess table.
        [HttpGet("[action]")]
        public IActionResult GetRoleModuleAccess()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Companies data");
                var data = roleService.GetRoleModuleAccess();

                response.Data = new
                {
                    roles = data
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

        // To Fetch Records from LBS_SYS_RoleModuleAccess table By ID.
        [HttpGet("[action]/{ID}")]
        public IActionResult GetRoleModuleAccesssByID(Guid ID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Company data by ID from storage");
                var data = roleService.GetRoleModuleAccesssByID(ID);

                response.Data = new
                {
                    rolemodule = data
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
        // Add Records into LBS_SYS_RoleModuleAccess table.
        [HttpPost("[action]")]
        public IActionResult AddRoleModuleAccess([FromBody]IList<LBS_SYS_RoleModuleAccess> lstLBS_SYS_RoleModuleAccess)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding the Modules to storage");
                var data = roleService.AddRoleModuleAccess(lstLBS_SYS_RoleModuleAccess);

                response.Data = new
                {
                    id = data
                };
                response.IsSuccess = true;
                response.Message = "Role Module added successfully";
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
        // Update Records into LBS_SYS_RoleModuleAccess table.
        [HttpPost("[action]")]
        public IActionResult UpdateRoleModuleAccess([FromBody]LBS_SYS_RoleModuleAccess lBS_SYS_RoleModuleAccess)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Updating the Company to storage");
                var data = roleService.UpdateRoleModuleAccess(lBS_SYS_RoleModuleAccess);

                response.Data = new
                {
                    id = data
                };
                response.IsSuccess = true;
                response.Message = "Company updated successfully";
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
        // Delete Records from LBS_SYS_RoleModuleAccess table.
        [HttpPost("[action]/{ID}/{DeletedBy}")]
        public IActionResult DeleteRoleModuleAccessByID(Guid ID, string DeletedBy)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Deleting the Company by ID from storage");
                var data = roleService.DeleteRoleModuleAccessByID(ID, DeletedBy);

                response.Data = new
                {
                    isDeleted = data
                };
                response.IsSuccess = true;
                response.Message = "Company deleted successfully";
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
        // To Fetch Records from LBS_SYS_RoleModuleAccess table By RoleID.
        [HttpGet("[action]/{RoleID}")]
        public IActionResult GetRoleModuleAccessByRoleID(Guid RoleID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Company data by ID from storage");
                var data = roleService.GetRoleModuleAccessByRoleID(RoleID);

                response.Data = new
                {
                    rolemodule = data
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

        // To Fetch Records from  LBS_SYS_RoleModuleAccess table By RoleID.
        [HttpGet("[action]/{RoleID}")]
        public IActionResult GetModulesExistsInRoleModuleAccess(Guid RoleID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Role Module data from storage");
                var data = roleService.GetModulesExistsInRoleModuleAccess(RoleID);

                response.Data = new
                {
                    roleModules = data
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
        // To Fetch Records from  LBS_SYS_RoleModuleAccess table By RoleID.
        [HttpGet("[action]/{RoleID}")]
        public IActionResult GetModulesNotExistsInRoleModuleAccess(Guid RoleID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Role Module data from storage");
                var data = roleService.GetModulesNotExistsInRoleModuleAccess(RoleID);

                response.Data = new
                {
                    roleModules = data
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

        [HttpGet("[action]/{RoleID}/{ModuleID}")]
        public IActionResult DeleteRoleModuleAccess(Guid RoleID,string  ModuleID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
             
                var data = roleService.DeleteRoleModuleAccess(RoleID, ModuleID);

                response.Data = new
                {
                    roleModules = data
                };
                response.IsSuccess = true;
               
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
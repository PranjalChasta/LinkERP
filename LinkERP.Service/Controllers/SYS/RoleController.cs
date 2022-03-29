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
    public class RoleController : ControllerBase
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private IRoleService roleService;
        public RoleController(ILogger<IRoleService> _logger, IRoleService _roleService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            roleService = _roleService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }
        [HttpGet("[action]")]
        public IActionResult GetAllRoles()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Roles data");
                var data = roleService.GetAllRoles();

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
        [HttpGet("[action]/{ID}")]
        public IActionResult GetRoleByID(Guid ID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Role data by ID from storage");
                var data = roleService.GetRoleByID(ID);

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
        [HttpPost("[action]")]
        public IActionResult AddRole([FromBody]LBS_SYS_Role lBS_SYS_Role)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding the Role to storage");
                var data = roleService.AddRole(lBS_SYS_Role);
                if (data == "Exist")
                {
                    response.IsSuccess = false;
                    response.Message = "Role code already exists";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "Role added successfully";
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
        [HttpPost("[action]")]
        public IActionResult UpdateRole([FromBody]LBS_SYS_Role lBS_SYS_Role)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Updating the Role to storage");
                var data = roleService.UpdateRole(lBS_SYS_Role);
                if (data == "Exist")
                {
                    response.IsSuccess = false;
                    response.Message = "Role code already exists";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "Role updated successfully";
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

        [HttpPost("[action]/{ID}/{DeletedBy}")]
        public IActionResult DeleteRoleByID(Guid ID, string DeletedBy)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Deleting the Role by ID from storage");
                var data = roleService.DeleteRoleByID(ID, DeletedBy);

                response.Data = new
                {
                    isDeleted = data
                };
                response.IsSuccess = true;
                response.Message = "Role deleted successfully";
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
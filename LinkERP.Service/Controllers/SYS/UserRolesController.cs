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
    public class UserRolesController : ControllerBase
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private IUserRolesService userRolesService;
        public UserRolesController(ILogger<UserRolesController> _logger, IUserRolesService _userRolesService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            userRolesService = _userRolesService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }

        [HttpPost("[action]")]
        public IActionResult AddUserRole([FromBody]LBS_SYS_UserRoles lBS_SYS_UserRoles)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                var request = Request;
                var headers = request.Headers;
                
                logger.LogInformation("Adding the User Role to storage");
                userRolesService.AddUserRole(lBS_SYS_UserRoles);

                response.Data = new
                {
                    id = ""
                };
                response.IsSuccess = true;
                response.Message = "User Role added successfully";
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


        [HttpGet("[action]/{LoginID}")]
        public IActionResult GetUserRolesByID(string LoginID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving UserRoles  data by ID from storage");
                var data = userRolesService.GetUserRolesByID(LoginID);

                response.Data = new
                {
                    UserRoles = data
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

        [HttpGet("[action]/{LoginID}")]
        public IActionResult GetRolesByID(string LoginID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Roles data by ID from storage");
                var data = userRolesService.GetRolesByID(LoginID);

                response.Data = new
                {
                    Roles = data
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
        [HttpGet("[action]/{LoginID}/{DefaultCompany}")]
        public IActionResult GetRolesByCompanyID(string LoginID, Guid DefaultCompany)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Roles data by ID from storage");
                var data = userRolesService.GetRolesByCompanyID(LoginID, DefaultCompany);

                response.Data = new
                {
                    Roles = data
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
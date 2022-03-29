using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
//using LinkERP.BLL.PUR.RequisitionDetails.Interfaces;
using LinkERP.BLL.SHARED.Interfaces;
using LinkERP.Entity;
using LinkERP.Entity.SHARED;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LinkERP.Service.Controllers.SHARED
{
    [Authorize]
    [Route("api/SHARED/[controller]")]
    [ApiController]
    public class SecurityPermissionsController : ControllerBase
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private ISecurityPermissionsService securityPermissionsService;
        public SecurityPermissionsController(ILogger<ISecurityPermissionsService> _logger, ISecurityPermissionsService _securityPermissionsService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            securityPermissionsService = _securityPermissionsService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }


        [HttpGet("[action]/{LoginID}/{CompanyID}")]
        public IActionResult GetAccessPermissions(string LoginID, Guid CompanyID)
        {
            AccessPermissions response = new AccessPermissions();
            try
            {
                logger.LogInformation("Reterving MenuPermissions data");
                var Menu = securityPermissionsService.GetMenuPermissions(LoginID, CompanyID);
                var Module = securityPermissionsService.GetModulePermissions(LoginID, CompanyID);
                var Companies = securityPermissionsService.GetCompaniesPermissions(LoginID);
                var Warehouses = securityPermissionsService.GetWarehousesPermissions(LoginID);

                response.MenuPermissions = Menu;
                response.ModulePermissions = Module;
                response.CompaniesPermissions = Companies;
                response.WarehousesPermissions = Warehouses;
                response.IsSuccess = true;
                response.Message = Menu == null ? "Record(s) not found" : "";
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

        [HttpGet("[action]/{LoginID}/{CompanyID}")]
        public IActionResult GetMenuPermissions(string LoginID, Guid CompanyID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Reterving MenuPermissions data");
                var data = securityPermissionsService.GetMenuPermissions(LoginID, CompanyID);
                response.Data = new
                {
                    menupermissions = data
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

        [HttpGet("[action]/{LoginID}/{CompanyID}")]
        public IActionResult GetModulePermissions(string LoginID, Guid CompanyID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                   
                logger.LogInformation("Reterving MenuPermissions data");
                var data = securityPermissionsService.GetModulePermissions(LoginID, CompanyID);
                response.Data = new
                {
                    menupermissions = data
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
        public IActionResult GetCompaniesPermissions(string LoginID, Guid CompanyID)
        {
            ResponseModel response = new ResponseModel();
            try
            {

                logger.LogInformation("Reterving MenuPermissions data");
                var data = securityPermissionsService.GetCompaniesPermissions(LoginID);
                response.Data = new
                {
                    menupermissions = data
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
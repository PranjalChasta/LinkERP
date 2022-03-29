using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LinkERP.BLL.SYS.Interfaces;
using LinkERP.Entity;
using LinkERP.Entity.PUR;
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
    public class RoleCompanyAccessController : ControllerBase
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private IRoleCompanyAccessService rolecompanyaccessService;
        public RoleCompanyAccessController(ILogger<IRoleService> _logger, IRoleCompanyAccessService _rolecompanyaccessService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            rolecompanyaccessService = _rolecompanyaccessService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }
        // Add Records into LBS_SYS_RoleCompanyAccess table.
        [HttpPost("[action]")]
        public IActionResult AddRoleCompanyAccess([FromBody]IList<LBS_SYS_RoleCompanyAccess> lBS_SYS_RoleCompanyAccess)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding the Rolecompanyaccess to storage");
                var data = rolecompanyaccessService.AddRoleCompanyAccess(lBS_SYS_RoleCompanyAccess);

                response.Data = new
                {
                    id = data
                };
                response.IsSuccess = true;
                response.Message = "Role Company Access added successfully";
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
        // Update Records into LBS_SYS_RoleCompanyAccess table.
        [HttpPost("[action]")]
        public IActionResult UpdateRoleCompanyAccess([FromBody]LBS_SYS_RoleCompanyAccess lBS_SYS_RoleCompanyAccess)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Updating the Rolecompanyaccess to storage");
                var data = rolecompanyaccessService.UpdateRoleCompanyAccess(lBS_SYS_RoleCompanyAccess);

                response.Data = new
                {
                    id = data
                };
                response.IsSuccess = true;
                response.Message = "Rolecompanyaccess updated successfully";
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
        // Delete Records from LBS_SYS_RoleCompanyAccess table.
        [HttpPost("[action]/{ID}/{DeletedBy}")]
        public IActionResult DeleteRoleCompanyAccessByID(Guid ID, Guid DeletedBy)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Deleting the Rolecompanyaccess by ID from storage");
                var data = rolecompanyaccessService.DeleteRoleCompanyAccessByID(ID, DeletedBy);

                response.Data = new
                {
                    isDeleted = data
                };
                response.IsSuccess = true;
                response.Message = "Rolecompanyaccess deleted successfully";
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

        // To Fetch Records from LBS_SYS_RoleCompanyAccess table By RoleID.
        [HttpGet("[action]/{RoleID}")]
        public IActionResult GetCompaniesExistsInRoleCompanyAccess(Guid RoleID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retrieving the Existed Companies by RoleID from storage");
                var data = rolecompanyaccessService.GetCompaniesExistsInRoleCompanyAccess(RoleID);

                response.Data = new
                {
                    companies = data
                };
                response.IsSuccess = true;
                response.Message = "Role Company Access retrieved successfully";
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
        [HttpGet("[action]/{AccessRoleId}/{RoleID}")]
        public IActionResult DeleteRoleCompanyAccess(Guid AccessRoleId, Guid RoleID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
              
                var data = rolecompanyaccessService.DeleteRoleCompanyAccess(AccessRoleId, RoleID);

                response.Data = new
                {
                    companies = data
                };
                response.IsSuccess = true;
                response.Message = "Role Company Access retrieved successfully";
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
        // To Fetch Records from LBS_SYS_RoleCompanyAccess table By RoleID.
        [HttpGet("[action]/{RoleID}")]
        public IActionResult GetCompaniesNotExistsInRoleCompanyAccess(Guid RoleID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retrieving the Not Existed Companies by RoleID from storage");
                var data = rolecompanyaccessService.GetCompaniesNotExistsInRoleCompanyAccess(RoleID);

                response.Data = new
                {
                    companies = data
                };
                response.IsSuccess = true;
                response.Message = "Role Company Access retrieved successfully";
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
        public IActionResult GetRoleCompanyAccessByRoleID(Guid RoleID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retrieving the Not Existed Companies by RoleID from storage");
                var data = rolecompanyaccessService.GetRoleCompanyAccessByRoleID(RoleID);

                response.Data = new
                {
                    RoleCompanyAccess = data
                };
                response.IsSuccess = true;
                response.Message = "Role Company Access retrieved successfully";
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
        //Warehouse
        [HttpGet("[action]/{RoleID}/{CompanyID}")]
        public IActionResult GetWareHousesNotExistsInRoleWarehouseyAccess(Guid RoleID, Guid CompanyID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retrieving the Not Existed warehouse by RoleID from storage");
                var data = rolecompanyaccessService.GetWareHousesNotExistsInRoleWarehouseyAccess(RoleID, CompanyID);

                response.Data = new
                {
                    warehouse = data
                };
                response.IsSuccess = true;
                response.Message = "Role warehouse Access retrieved successfully";
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
        [HttpGet("[action]/{RoleID}/{CompanyID}")]
        public IActionResult GetWareHousesExistsInRoleWarehouseyAccess(Guid RoleID, Guid CompanyID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retrieving  Existed warehouse by RoleID from storage");
                var data = rolecompanyaccessService.GetWareHousesExistsInRoleWarehouseyAccess(RoleID, CompanyID);

                response.Data = new
                {
                    warehouse = data
                };
                response.IsSuccess = true;
                response.Message = "Role warehouse Access retrieved successfully";
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

        [HttpGet("[action]/{CompanyID}")]
        public IActionResult GetWareHouses(Guid CompanyID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("allwarehouse from storage");
                var data = rolecompanyaccessService.GetWareHouses(CompanyID);

                response.Data = new
                {
                    allwarehouse = data
                };
                response.IsSuccess = true;
                response.Message = "allwarehouse retrieved successfully";
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
        public IActionResult AddRoleWarehouseAccess([FromBody]IList<LBS_SYS_RoleCompanyWarehouseAccess> LBS_SYS_RoleCompanyWarehouseAccess)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding the RoleWarehouseaccess to storage");
                var data = rolecompanyaccessService.AddRoleWarehouseAccess(LBS_SYS_RoleCompanyWarehouseAccess);

                response.Data = new
                {
                    id = data
                };
                response.IsSuccess = true;
                response.Message = "Role RoleWarehouseaccess added successfully";
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

        [HttpGet("[action]/{RoleID}/{WarehouseID}/{CompanyID}")]
        public IActionResult DeleteRoleWarehouseAccessByID(Guid RoleID, Guid WarehouseID, Guid CompanyID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("DeleteRoleWarehouseAccessByID by ID from storage");
                var data = rolecompanyaccessService.DeleteRoleWarehouseAccessByID(RoleID, WarehouseID, CompanyID);

                response.Data = new
                {
                    isDeleted = data
                };
                response.IsSuccess = true;
                response.Message = "DeleteRoleWarehouseAccessByID successfully";
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
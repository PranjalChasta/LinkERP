using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using LinkERP.BLL.SYS.Interfaces;
using LinkERP.Entity;
using LinkERP.Entity.SYS;
using Microsoft.AspNetCore.Hosting;
using LinkERP.BLL.SYS;

namespace LinkERP.Service.Controllers.SYS
{
    [Route("api/SYS/[controller]")]
    [ApiController]
    public class PayTeamController : ControllerBase
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private IPayTeamService payTeamService;
        public PayTeamController(ILogger<IPayTeamService> _logger, PayTeamService _payTeamService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            payTeamService = _payTeamService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }

        // To Fetch All Records from LBS_SYS_RoleCompanyPayTeamAccess table.
        [HttpGet("[action]")]
        public IActionResult GetPayTeamData(Guid CompanyID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving PayTeam data");
                var data = payTeamService.GetPayTeamData(CompanyID);

                response.Data = new
                {
                    payTeamData = data
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
        // To Add Records to LBS_SYS_RoleCompanyPayTeamAccess table.
        [HttpPost("[action]")]
        public IActionResult AddPayTeam([FromBody]LBS_SYS_RoleCompanyPayTeamAccess lBS_SYS_RolePayTeamAccess)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding the PayTeam to storage");
                var data = payTeamService.AddPayTeam(lBS_SYS_RolePayTeamAccess);

                response.Data = new
                {
                    id = data
                };
                response.IsSuccess = true;
                response.Message = "PayTeam added successfully";
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

        // Update Records into LBS_SYS_RoleCompanyPayTeamAccess table.
        [HttpPost("[action]")]
        public IActionResult UpdatePayTeam([FromBody]LBS_SYS_RoleCompanyPayTeamAccess LBS_SYS_RolePayTeamAccess)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Updating the Currency Details to storage");
                var data = payTeamService.UpdatePayTeam(LBS_SYS_RolePayTeamAccess);

                response.Data = new
                {
                    id = data
                };
                response.IsSuccess = true;
                response.Message = "Currency Details updated successfully";
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
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DTO.SYS.UserProfile;
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
    public class UserProfileController : ControllerBase
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private IUserProfileService userProfileService;
        public UserProfileController(ILogger<BankController> _logger, IUserProfileService _userProfileService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            userProfileService = _userProfileService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }

        [HttpGet("[action]/{LoginID}")]
        public IActionResult GetUserByLoginID(string LoginID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving User data by ID from storage");
                var data = userProfileService.GetUserByLoginID(LoginID);

                response.Data = new
                {
                    User = data
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
        public IActionResult UpdateUser([FromBody]User lBS_SYS_User)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Updating User Profile data from storage");
                userProfileService.UpdateUser(lBS_SYS_User);
                //response.Data =
                response.IsSuccess = true;
                response.Message = "User Profile updated successfully";
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
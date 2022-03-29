using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LinkERP.BLL.SYS.Interfaces;
using LinkERP.Entity;
using LinkERP.Entity.SYS;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LinkERP.Service.Controllers.SYS
{
    [Authorize]
    [Route("api/SYS/[controller]")]
    [ApiController]
    public class CountryStateController : Controller
    {
       
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private ICountryStateService countrystateService ;
        public CountryStateController(ILogger<ICompanyService> _logger, ICountryStateService _countrystateService , IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            countrystateService = _countrystateService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }


        // To Fetch Records from LBS_SYS_CountryState table By ID.
        [HttpGet("[action]/{ID}")]
        public IActionResult GetCountryStateByID (Guid ID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving CountryState data by ID from storage");
                var data = countrystateService.GetCountryStateByID(ID);

                response.Data = new
                {
                    countrystates   = data
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

        // Add Records into LBS_SYS_CountryState table.
        [HttpPost("[action]")]
        public IActionResult AddCountryState ([FromBody]LBS_SYS_CountryState lBS_SYS_CountryState )
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding the CountryState to storage");
                var data = countrystateService.AddCountryState(lBS_SYS_CountryState);

                if (data == "Exists")
                {
                    response.IsSuccess = false;
                    response.Message = "State Code  Already Exists";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "State Code added successfully";
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
        // Update Records into LBS_SYS_CountryState table.
        [HttpPost("[action]")]
        public IActionResult UpdateCountryState ([FromBody]LBS_SYS_CountryState lBS_SYS_CountryState )
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Updating the CountryState to storage");
                var data = countrystateService.UpdateCountryState(lBS_SYS_CountryState );
                if (data == "Exists")
                {
                    response.IsSuccess = false;
                    response.Message = "State Code  Already Exists";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "CountryState updated successfully";
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
        // Delete Records from LBS_SYS_CountryState table.
        [HttpPost("[action]/{ID}/{DeletedBy}")]
        public IActionResult DeleteCountryStateByID (Guid ID, string DeletedBy)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Deleting the Company by ID from storage");
                var data = countrystateService.DeleteCountryStateByID(ID, DeletedBy);

                response.Data = new
                {
                    isDeleted = data
                };
                response.IsSuccess = true;
                response.Message = "Countrystate deleted successfully";
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

        [HttpGet("[action]/{CountryID}")]
        public IActionResult GetStateByCountryID(Guid CountryID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving CountryState data by ID from storage");
                var data = countrystateService.GetStateByCountryID(CountryID);

                response.Data = new
                {
                    countrystates = data
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
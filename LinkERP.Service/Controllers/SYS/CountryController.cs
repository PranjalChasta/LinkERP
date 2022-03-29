using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LinkERP.BLL.SYS.Interfaces;
using LinkERP.Entity;
using LinkERP.Entity.SYS;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;


namespace LinkERP.Service.Controllers.SYS
{
   // [Authorize]
    [Route("api/SYS/[controller]")]
    [ApiController]
    public class CountryController :ControllerBase
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private ICountryService countryService;
        public CountryController(ILogger<ICountryService> _logger, ICountryService _countryService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            countryService = _countryService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }
        // Add Records into LBS_SYS_Country table.
        [HttpPost("[action]")]
        public IActionResult AddCountry([FromBody]LBS_SYS_Country lBS_SYS_Country)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding Country to storage");
                var data = countryService.AddCountry(lBS_SYS_Country);
                if (data == "Exist")
                {
                    response.IsSuccess = false;
                    response.Message = "Country Code Already Exists"; 
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "Country added successfully"; 
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

        // Update Records into LBS_SYS_Country table.
        [HttpPost("[action]")]
        public IActionResult UpdateCountry([FromBody]LBS_SYS_Country lBS_SYS_Country)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Updating the Country to storage");
                var data = countryService.UpdateCountry(lBS_SYS_Country);
                if (data == "Exist")
                {
                    response.IsSuccess = false;
                    response.Message = "Country Code Already Exists";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "Country updated successfully";
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

        // To Fetch Records from LBS_SYS_Country table By ID.
        [HttpGet("[action]/{CountryID}")]
        public IActionResult GetCountryByID(Guid CountryID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retrieving Country data by ID from storage");
                var data = countryService.GetCountryByID(CountryID);

                response.Data = new
                {
                    country = data
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

        // Delete Records from LBS_SYS_Country table.
        [HttpPost("[action]/{ID}/{DeletedBy}")]
        public IActionResult DeleteCountryByID(Guid ID, string DeletedBy)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Deleting the WorkFlow by ID from storage");
                var data = countryService.DeleteCountryByID(ID, DeletedBy);

                response.Data = new
                {
                    isDeleted = data
                };
                response.IsSuccess = true;
                response.Message = "Country deleted successfully";
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

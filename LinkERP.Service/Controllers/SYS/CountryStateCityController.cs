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
    [Authorize]
    [Route("api/SYS/[controller]")]
    [ApiController]
    public class CountryStateCityController : ControllerBase
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private ICountryStateCityService cityService;
        public CountryStateCityController(ILogger<ICountryStateCityService> _logger, ICountryStateCityService _cityService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            cityService = _cityService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }
        // To Fetch Records from LBS_SYS_CountryStateCity table By ID.
        [HttpGet("[action]/{CityID}")]
        public IActionResult GetCityByID(Guid CityID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Company data by ID from storage");
                var data = cityService.GetCityByID(CityID);

                response.Data = new
                {
                    citydetails = data
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
        // Add Records into LBS_SYS_CountryStateCity table.
        [HttpPost("[action]")]
        public IActionResult AddCity([FromBody]LBS_SYS_CountryStateCity lBS_SYS_CountryStateCity)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding the City to storage");
                var data = cityService.AddCity(lBS_SYS_CountryStateCity);

                if (data == "Exists")
                {
                    response.IsSuccess = false;
                    response.Message = "City Code Already Exists";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "City Code added successfully";
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
        // Update Records into LBS_SYS_CountryStateCity table.
        [HttpPost("[action]")]
        public IActionResult UpdateCity([FromBody]LBS_SYS_CountryStateCity lBS_SYS_CountryStateCity)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Updating the Company to storage");
                var data = cityService.UpdateCity(lBS_SYS_CountryStateCity);
                if (data == "Exists")
                {
                    response.IsSuccess = false;
                    response.Message = "City Code Already Exists";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "City updated successfully";
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
        // Delete Records from LBS_SYS_CountryStateCity table.
        [HttpPost("[action]/{ID}/{DeletedBy}")]
        public IActionResult DeleteCityByID(Guid ID, string DeletedBy)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Deleting the City by ID from storage");
                var data = cityService.DeleteCityByID(ID, DeletedBy);

                response.Data = new
                {
                    isDeleted = data
                };
                response.IsSuccess = true;
                response.Message = "City deleted successfully";
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

        [HttpGet("[action]/{StateID}")]
        public IActionResult GetCityByStateID(Guid StateID) 
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Company data by ID from storage");
                var data = cityService.GetCityByStateID(StateID);

                response.Data = new
                {
                    citydetails = data
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
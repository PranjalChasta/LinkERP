using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc; 
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging; 
using LinkERP.Entity;
using LinkERP.Entity.SYS;
using Microsoft.AspNetCore.Hosting;
using LinkERP.BLL.SYS.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace LinkERP.Service.Controllers.SYS
{
   // [Authorize]
    [Route("api/SYS/[controller]")]
    [ApiController]
    public class FrequencyController : BaseController
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private IFrequencyService frequencyService;
        public FrequencyController(ILogger<IFrequencyService> _logger, IFrequencyService _frequencyService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            frequencyService = _frequencyService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }
        // To Fetch All Records from LBS_SYS_Frequency table.
        [HttpGet("[action]")]
        public IActionResult GetFrequency()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Frequency data");
                var data = frequencyService.GetFrequency(CompanyID); 
                response.Data = new
                {
                    frequency = data
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

        // To Fetch Records from LBS_SYS_Frequency table By ID.
        [HttpGet("[action]/{ID}")]
        public IActionResult GetFrequencyByID(Guid ID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Frequency data by ID from storage");
                var data = frequencyService.GetFrequencyByID(ID);

                response.Data = new
                {
                    frequencystatus = data
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

        // Add Records into LBS_SYS_Frequency table.
        [HttpPost("[action]")]
        public IActionResult AddFrequency ([FromBody]LBS_SYS_Frequency lBS_SYS_frequency)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding the Frequency to storage");
                var data = frequencyService.AddFrequency(lBS_SYS_frequency);

                if (data == "Exists")
                {
                    response.IsSuccess = false;
                    response.Message = "Frequency Name Already Exists";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "Frequency Name added successfully";
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
        // Update Records into LBS_SYS_Frequency table.
        [HttpPost("[action]")]
        public IActionResult UpdateFrequency ([FromBody]LBS_SYS_Frequency lBS_SYS_frequency)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Updating the Frequency to storage");
                var data = frequencyService.UpdateFrequency(lBS_SYS_frequency);
                if (data == "Exists")
                {
                    response.IsSuccess = false;
                    response.Message = "Frequency Name Already Exists";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "Frequency updated successfully";
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
        // To Fetch Records from LBS_SYS_Frequency table By ID.
        [HttpGet("[action]/{CompanyID}")]
        public IActionResult GetFrequencyByCompanyID(Guid CompanyID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Frequency data by ID from storage");
                var data = frequencyService.GetFrequencyByCompanyID(CompanyID);

                response.Data = new
                {
                    frequency = data
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

        // Delete Records from LBS_SYS_Frequency table.
        [HttpPost("[action]/{ID}/{DeletedBy}")]
        public IActionResult DeleteFrequencyByID(Guid ID, string DeletedBy)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Deleting the Frequency by ID from storage");
                var data = frequencyService.DeleteFrequencyByID(ID, DeletedBy);

                response.Data = new
                {
                    isDeleted = data
                };
                response.IsSuccess = true;
                response.Message = "Frequency deleted successfully";
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
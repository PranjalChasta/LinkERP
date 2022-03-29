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
    public class JobController : BaseController
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private IJobService jobService;
        public JobController(ILogger<IJobService> _logger, IJobService _jobService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            jobService = _jobService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }


        [HttpGet("[action]")]
        public IActionResult GetJobs()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Companies data");
                var data = jobService.GetJobs(CompanyID);

                response.Data = new
                {
                    jobs = data
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
        public IActionResult GetJobByID(Guid ID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Company data by ID from storage");
                var data = jobService.GetJobByID(ID);

                response.Data = new
                {
                    job = data
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
        public IActionResult AddJob([FromBody]LBS_SYS_Jobs lBS_SYS_Jobs)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding the Company to storage");
                var data = jobService.AddJob(lBS_SYS_Jobs);

                if (data == "Exists")
                {
                    response.IsSuccess = false;
                    response.Message = "Job Code Already Exists";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "Job Code   added successfully";
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
        public IActionResult UpdateJob([FromBody]LBS_SYS_Jobs lBS_SYS_Jobs)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Updating the Company to storage");
                var data = jobService.UpdateJob(lBS_SYS_Jobs);

                if (data == "Exists")
                {
                    response.IsSuccess = false;
                    response.Message = "Job Code Already Exists";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "Job Code updated successfully";
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
        public IActionResult DeleteJobByID(Guid ID, string DeletedBy)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Deleting the Company by ID from storage");
                var data = jobService.DeleteJobByID(ID, DeletedBy);

                response.Data = new
                {
                    isDeleted = data
                };
                response.IsSuccess = true;
                response.Message = "Company deleted successfully";
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